import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import * as crypto from 'crypto'

// GitHub Pages の公開パス: https://naoji3x.github.io/grandma-candy-shop/
const base = '/grandma-candy-shop/'

function hashCode(code: string): string {
  return crypto.createHash('md5').update(code).digest('hex').slice(0, 8)
}

export default defineConfig({
  title: 'Grandma Candy Shop Docs',
  description: 'Documentation for Grandma Candy Shop',
  base,

  themeConfig: {
    sidebar: generateSidebar({
      documentRootPath: 'docs',
      scanStartPath: '.',
      useTitleFromFileHeading: false,
      collapseDepth: 2,
      collapsed: true, // デフォルトは折りたたんだ状態にする
    }),
  },

  markdown: {
    //
    // ```mermaid ... ``` のコードブロックを
    // <img src="/mermaid/<hash>.svg"> に差し替える
    // （Markdownファイルは書き換えない。HTML生成時だけ差し替え）
    //
    config: md => {
      // インラインコード `...` は必ず v-pre を付けて出力
      //    → `{{ ... }}` を Vue がパースしなくなる
      md.renderer.rules.code_inline = (tokens, idx) => {
        const token = tokens[idx]
        const content = md.utils.escapeHtml(token.content)
        return `<code v-pre>${content}</code>`
      }

      const defaultFence = md.renderer.rules.fence

      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const info = (token.info || '').trim()

        if (info === 'mermaid') {
          const code = token.content.trim()
          const id = hashCode(code)
          const src = `/mermaid/${id}.svg`

          // 800x800 を超える場合はスクロールさせるためのラッパーを用意
          // 具体的な判定は CSS / JS 側で行う想定（ここではクラスだけ付与）
          return `
              <p class="mermaid-container">
                <img src="${src}" alt="mermaid diagram" loading="lazy" class="mermaid-image">
              </p>\n`
        }

        // それ以外のコードブロックはデフォルトの描画
        return defaultFence
          ? defaultFence(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
      }
    },
  },
})
