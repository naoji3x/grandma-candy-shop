import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import * as crypto from 'crypto'

const ROOT = path.resolve('docs')
const OUT_DIR = path.join(ROOT, 'public', 'mermaid')

/**
 * Mermaidコードの内容からハッシュを作って、SVGファイル名に使う
 * → 同じコードなら同じSVGを使い回せる
 */
function hashCode(code: string): string {
  return crypto.createHash('md5').update(code).digest('hex').slice(0, 8)
}

function walk(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const full = path.join(dir, entry.name)

    // .vitepress や public などは無視
    if (entry.isDirectory()) {
      if (entry.name === '.vitepress' || entry.name === 'public' || entry.name === 'node_modules') {
        continue
      }
      walk(full)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      processMarkdown(full)
    }
  }
}

function processMarkdown(mdPath: string): void {
  const text = fs.readFileSync(mdPath, 'utf8')

  // ```mermaid ... ``` を全部拾う
  const mermaidBlocks = [...text.matchAll(/```mermaid([\s\S]*?)```/g)]
  if (mermaidBlocks.length === 0) {
    return
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })

  for (const match of mermaidBlocks) {
    const code = match[1].trim()
    if (!code) continue

    const id = hashCode(code)
    const svgPath = path.join(OUT_DIR, `${id}.svg`)

    // 既に同じコードのSVGがあれば再生成しない
    if (fs.existsSync(svgPath)) {
      continue
    }

    const tmpMmd = path.join(ROOT, `.tmp-${id}.mmd`)
    fs.writeFileSync(tmpMmd, code, 'utf8')

    console.log(`🌀 Generating mermaid SVG: ${path.relative(process.cwd(), svgPath)}`)

    // mermaid-cli を使って .mmd → .svg
    // docs/ をカレントにすると相対パスがシンプルになる
    execSync(`npx mmdc -i "${tmpMmd}" -o "${svgPath}"`, {
      stdio: 'inherit',
    })

    fs.unlinkSync(tmpMmd)
  }
}

;(function main() {
  console.log('🔍 Scanning docs for mermaid code blocks...')
  walk(ROOT)
  console.log('✅ Mermaid SVG generation done.')
})()
