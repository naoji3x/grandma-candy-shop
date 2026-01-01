import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import * as crypto from 'crypto'

const ROOT = path.resolve('docs')
const OUT_DIR = path.join(ROOT, 'public', 'mermaid')
const PUPPETEER_CONFIG = path.resolve('puppeteer-config.json')
const MERMAID_CONFIG = path.resolve('mermaid-config.json')

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

/**
 * SVG の viewBox を読み取り、その値で width / height 属性を上書きする。
 * すでに width="100%" などが付いていても削除してから付け直します。
 */
function normalizeSvgSize(svgPath: string): void {
  let svg = fs.readFileSync(svgPath, 'utf8')

  // viewBox="minX minY W H" を探す
  const vbMatch = svg.match(/viewBox="([^"]+)"/)
  if (!vbMatch) {
    return
  }

  const parts = vbMatch[1].trim().split(/\s+/)
  if (parts.length !== 4) {
    return
  }

  const [, , w, h] = parts // [minX, minY, width, height] を想定

  // 開始タグ <svg ...> をキャプチャ
  const tagMatch = svg.match(/<svg[^>]*>/)
  if (!tagMatch) {
    return
  }

  const originalTag = tagMatch[0]
  // "<svg" と ">" を除いた属性部分を取り出す
  const attrs = originalTag.slice('<svg'.length, -1) // 先頭 "<svg" と末尾 ">" を除去した部分

  // 属性文字列から既存の width / height を削除
  const cleanedAttrs = attrs.replace(/\swidth="[^"]*"/, '').replace(/\sheight="[^"]*"/, '')

  // 新しい svg タグを組み立て
  // cleanedAttrs は先頭にスペースを含んでいるので、そのまま連結してOK
  const newTag = `<svg width="${w}" height="${h}"${cleanedAttrs}>`

  // タグ全体を置き換え
  svg = svg.replace(originalTag, newTag)

  fs.writeFileSync(svgPath, svg, 'utf8')
}

function processMarkdown(mdPath: string): void {
  console.log(`🌀 Generating mermaid SVG from: ${path.relative(process.cwd(), mdPath)}`)

  const text = fs.readFileSync(mdPath, 'utf8')

  // ✅ 行頭の ```mermaid ... ``` だけを拾う
  const mermaidBlocks = [...text.matchAll(/^```mermaid[^\n]*\n([\s\S]*?)^```/gm)]
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
    execSync(
      `npx mmdc -p "${PUPPETEER_CONFIG}" -c "${MERMAID_CONFIG}" -i "${tmpMmd}" -o "${svgPath}"`,
      { stdio: 'inherit' }
    )

    // ✅ ここで width/height を viewBox から上書き
    normalizeSvgSize(svgPath)

    fs.unlinkSync(tmpMmd)
  }
}

;(function main() {
  console.log('🔍 Scanning docs for mermaid code blocks...')
  walk(ROOT)
  console.log('✅ Mermaid SVG generation done.')
})()
