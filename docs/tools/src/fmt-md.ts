import fs from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'

const DEFAULT_GLOBS = ['docs/**/*.{md,mdx}']
const IGNORE_GLOBS = ['**/node_modules/**', '**/.git/**', '**/dist/**']

function normalizeTableDelims(markdown: string): string {
  // 1行ずつ処理（CRLF/LFどちらも対応）
  const lines = markdown.split(/\r?\n/)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 「テーブルの区切り行っぽい」判定：
    // - パイプが含まれる
    // - ハイフンが含まれる
    // - それ以外の文字がほぼ無い（ただし空白は許容）
    if (!line.includes('|') || !line.includes('-')) continue

    // 先頭/末尾のパイプはあってもなくてもOKとして扱う
    const trimmed = line.trim()

    // 区切り行に使われる文字以外が混ざっていたらスキップ（安全側）
    // 許可: | : - 空白/タブ
    if (!/^[\s|:-]+$/.test(trimmed)) continue

    // セル分割（両端の|がなくても分割できるように）
    const rawCells = trimmed.replace(/^\|/, '').replace(/\|$/, '').split('|')

    // 各セルが「区切りセル」っぽい（例: -, --, :---, ---:, :---:）なら正規化
    // それ以外が混ざる行は区切り行ではないのでスキップ
    const cells = rawCells.map(c => c.trim())
    if (cells.length < 2) continue

    let allDelimiterLike = true
    for (const c of cells) {
      // 例: "-", "--", ":--", "--:", ":--:" を許容
      if (!/^:?-+:?:?$/.test(c)) {
        allDelimiterLike = false
        break
      }
    }
    if (!allDelimiterLike) continue

    // 正規化（ハイフンは必ず3本、コロンは維持）
    const normalized = cells.map(cell => {
      const left = cell.startsWith(':')
      const right = cell.endsWith(':')
      if (left && right) return ':---:'
      if (left) return ':---'
      if (right) return '---:'
      return '---'
    })

    // 既存の「両端に|がある/ない」を維持
    const hasLeadingPipe = /^\s*\|/.test(line)
    const hasTrailingPipe = /\|\s*$/.test(line)

    const rebuilt =
      (hasLeadingPipe ? '| ' : '') + normalized.join(' | ') + (hasTrailingPipe ? ' |' : '')

    // 元のインデント（先頭スペース）も維持したい場合はここで合わせる
    const indent = line.match(/^\s*/)?.[0] ?? ''
    lines[i] = indent + rebuilt
  }

  return lines.join('\n')
}

function createProcessor() {
  return unified().use(remarkParse).use(remarkGfm, { tablePipeAlign: false }).use(remarkStringify, {
    // 水平線は --- に統一したい（*** にならないように）
    rule: '-',
    ruleRepetition: 3,
    ruleSpaces: false,
    // 箇条書きを - に統一したいなら（不要なら消してOK）
    bullet: '-',
  })
}

async function resolveTargets(args: string[]): Promise<string[]> {
  // 保存時は VS Code から file path が1つ渡される想定
  const raw = args.filter(Boolean)

  if (raw.length === 0) {
    // 手動実行用（全体）
    return fg(DEFAULT_GLOBS, { ignore: IGNORE_GLOBS, dot: false })
  }

  // 受け取った引数が glob の可能性もあるので fast-glob で解決
  const expanded = await fg(raw, { ignore: IGNORE_GLOBS, dot: false, onlyFiles: true })

  // glob が展開されない（=実ファイルが渡された）ケースも吸収
  const passthrough = raw
    .filter(p => !p.includes('*') && !p.includes('?') && !p.includes('{'))
    .map(p => p.replace(/^"(.*)"$/, '$1'))

  const set = new Set<string>()
  for (const f of [...expanded, ...passthrough]) {
    // 正規化（Windowsパスも考慮）
    set.add(path.normalize(f))
  }
  return [...set]
}

async function formatOneFile(filePath: string, processor: ReturnType<typeof createProcessor>) {
  // md/mdx 以外はスキップ
  if (!/\.(md|mdx)$/i.test(filePath)) return

  let input: string
  try {
    input = await fs.readFile(filePath, 'utf8')
  } catch {
    return // ファイルが消えた等
  }

  const vfile = await processor.process(input)
  const formatted = String(vfile)

  console.log(`Formatted: ${filePath}`)
  // console.log(formatted)

  // ここで区切り行を必ず | --- | に正規化
  const output = normalizeTableDelims(formatted)

  // console.log(output)

  if (output !== input) {
    await fs.writeFile(filePath, output, 'utf8')
  }
}

async function main() {
  const args = process.argv.slice(2)
  console.log('Formatting markdown files:', args.length > 0 ? args : '[all docs]')
  const targets = await resolveTargets(args)
  if (targets.length === 0) return

  const processor = createProcessor()

  // 保存時の体感を落とさないように、逐次処理（並列にしたいなら後で）
  for (const file of targets) {
    await formatOneFile(file, processor)
  }
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
