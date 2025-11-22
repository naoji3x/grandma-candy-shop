import { defineConfig } from 'vitepress'
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
    // 必要ならここに sidebar などを設定
  },

  markdown: {
    //
    // ```mermaid ... ``` のコードブロックを
    // <img src="[base]/mermaid/<hash>.svg"> に差し替える
    // （Markdownファイルは書き換えない。HTML生成時だけ差し替え）
    //
    config: md => {
      const defaultFence = md.renderer.rules.fence

      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const info = (token.info || '').trim()

        if (info === 'mermaid') {
          const code = token.content.trim()
          const id = hashCode(code)
          const src = `${base}mermaid/${id}.svg`
          return `<p><img src="${src}" alt="mermaid diagram" loading="lazy"></p>\n`
        }

        // それ以外のコードブロックはデフォルトの描画
        return defaultFence
          ? defaultFence(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
      }
    },
  },
})
