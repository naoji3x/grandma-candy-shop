//
// docs/**/*.md(x) の先頭H1を front matter の title に同期するスクリプト
// 使い方:
//   npm tsx docs/tools/src/sync-frontmatter-title.ts              // 一括
//   npm tsx docs/tools/src/sync-frontmatter-title.ts docs/a.md    // 単体
//
import { readFile, writeFile } from 'node:fs/promises'
import fg from 'fast-glob'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdx from 'remark-mdx'

type Node =
  | { type: 'heading'; depth: number; children?: Node[] }
  | { type: string; value?: string; children?: Node[] }
  | any

/** MDAST から最初の H1 テキストを抽出 */
function extractFirstH1(mdast: Node): string | null {
  const children: Node[] = (mdast as any).children ?? []
  for (const node of children) {
    if (node.type === 'heading' && (node as any).depth === 1) {
      return flatText(node)
    }
  }
  return null
}

/** ノード配下のテキストを平坦化して結合（強調/コード等は中身だけを取り出す） */
function flatText(node: Node): string {
  if (!node) return ''
  if (typeof (node as any).value === 'string') return (node as any).value as string
  const kids: Node[] = (node as any).children ?? []
  return kids.map(flatText).join('')
}

/** 1ファイルを同期。更新したら true を返す */
async function syncOne(filePath: string): Promise<boolean> {
  const raw = await readFile(filePath, 'utf8')
  const fm = matter(raw)

  // front matter 以降（本文）をパースして H1 を拾う
  const mdast = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkMdx)
    .parse(fm.content) as Node

  const h1 = extractFirstH1(mdast)
  if (!h1) return false // H1 が無い場合は何もしない

  const current = (fm.data as any)?.title
  if (current === h1) return false // すでに一致

  // front matter を上書きして保存
  const next = matter.stringify(fm.content, { ...fm.data, title: h1 })
  // gray-matter は区切り線を含まない本文＋fm.dataから本文を生成するため、先頭に '---\n' は不要
  await writeFile(filePath, `---\n${next}`)
  return true
}

async function main() {
  const targets = process.argv.slice(2)
  const files = targets.length
    ? targets
    : await fg(['docs/**/*.{md,mdx}', '!**/*.preview.*'], { dot: true })

  let updated = 0
  for (const f of files) {
    try {
      const changed = await syncOne(f)
      if (changed) {
        updated++
        console.log(`synced title -> ${f}`)
      }
    } catch (e: any) {
      console.error(`Error: ${f}: ${e?.message ?? e}`)
      process.exitCode = 1
    }
  }
  if (updated) console.log(`done: ${updated} file(s) updated`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
