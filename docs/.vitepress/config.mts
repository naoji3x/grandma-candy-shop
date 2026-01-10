import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import * as crypto from 'crypto'

// GitHub Pages の公開パス: https://naoji3x.github.io/grandma-candy-shop/
const base = '/grandma-candy-shop/'

const hashCode = (code: string): string =>
  crypto.createHash('md5').update(code).digest('hex').slice(0, 8)

type SidebarItem = {
  text?: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

/**
 * 追加したいロケールはここに足すだけでOK
 * - locale: URL と docs/<locale>/ のディレクトリ名に使う
 * - label: 言語セレクター表示名
 * - lang: <html lang="..."> に使う
 */
const LOCALES = [
  { locale: 'ja', label: '日本語', lang: 'ja' },
  { locale: 'en', label: 'English', lang: 'en' },
] as const
type Locale = (typeof LOCALES)[number]['locale']

// link から末尾要素（拡張子なし想定）を取り出す："/foo/010-bar" -> "010-bar"
const getBaseFromLink = (link?: string): string => {
  if (!link) return ''
  const clean = link.split('#')[0].replace(/\/+$/, '')
  return clean.split('/').pop() ?? ''
}

// "xxx-" を削除（xxx は英小文字）
const stripLeadingXxxDash = (label: string): string => {
  return label.replace(/^[a-z]+-/, '')
}

// 判定：README / *rules / *instruction
const isReadme = (item: SidebarItem): boolean => {
  return getBaseFromLink(item.link).toLowerCase() === 'readme'
}

const isRules = (item: SidebarItem): boolean => {
  return getBaseFromLink(item.link).toLowerCase().endsWith('rules')
}

const isInstruction = (item: SidebarItem): boolean => {
  return getBaseFromLink(item.link).toLowerCase().endsWith('instruction')
}

// 既に /<locale>/ が付いているかを LOCALES から判定（将来増えてもOK）
const isAlreadyPrefixedByAnyLocale = (path: string): boolean => {
  return LOCALES.some(({ locale }) => path === `/${locale}` || path.startsWith(`/${locale}/`))
}

// ソート用のキー：
// 1) README（最優先）
// 2) *rules（次）
// 2) *instruction（次）
// 3) その他：先頭 xxx- を削除した名前でファイル名順
const sortKey = (item: SidebarItem): { bucket: number; name: string } => {
  if (isReadme(item)) return { bucket: 0, name: '' }
  if (isRules(item)) return { bucket: 1, name: getBaseFromLink(item.link).toLowerCase() }
  if (isInstruction(item)) return { bucket: 2, name: getBaseFromLink(item.link).toLowerCase() }
  return { bucket: 3, name: stripLeadingXxxDash(getBaseFromLink(item.link)).toLowerCase() }
}

const normalizeAndPrefixLink = (link: string, locale: Locale): string => {
  // hash は保持して、パス部分だけ正規化
  const [path0, hash] = link.split('#')
  const path = path0.startsWith('/') ? path0 : `/${path0}`

  const prefixedPath = isAlreadyPrefixedByAnyLocale(path)
    ? path
    : path === '/'
      ? `/${locale}/`
      : `/${locale}${path}`

  return hash ? `${prefixedPath}#${hash}` : prefixedPath
}

// 再帰的に: 表示名整形（xxx-削除）、並び替え
const transformSidebar = (items: SidebarItem[], locale: Locale): SidebarItem[] => {
  const transformed = items.map(it => {
    const next: SidebarItem = { ...it }

    // prev/next 解決
    if (next.link) next.link = normalizeAndPrefixLink(next.link, locale)

    // 子も同じルールで処理
    if (next.items) next.items = transformSidebar(next.items, locale)

    // 表示テキストの先頭 xxx- を削除（README も rules も含めて削除してOKならこのまま）
    if (
      typeof next.text === 'string' &&
      next.text.trim().length > 0 &&
      !isReadme(next) &&
      !isRules(next) &&
      !isInstruction(next)
    ) {
      next.text = stripLeadingXxxDash(next.text)
    }

    return next
  })

  transformed.sort((a, b) => {
    const ka = sortKey(a)
    const kb = sortKey(b)
    if (ka.bucket !== kb.bucket) return ka.bucket - kb.bucket
    return ka.name.localeCompare(kb.name, 'ja')
  })

  return transformed
}

// ★ここ重要：言語フォルダを documentRootPath にする
const makeSidebar = (locale: Locale): SidebarItem[] =>
  transformSidebar(
    generateSidebar({
      documentRootPath: 'docs',
      scanStartPath: locale, // locale の中をスキャン
      useTitleFromFileHeading: false,
      collapseDepth: 2,
      collapsed: true,
    }) as SidebarItem[],
    locale
  )

export default defineConfig({
  title: 'Grandma Candy Shop Docs',
  description: 'Documentation for Grandma Candy Shop',
  base,

  locales: {
    ja: {
      label: '日本語',
      lang: 'ja',
      // 言語メニューで押したときのリンク先（日本語トップ）
      link: '/ja/',
      themeConfig: {
        sidebar: makeSidebar('ja'),
        langMenuLabel: '言語',
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        sidebar: makeSidebar('en'),
        langMenuLabel: 'Language',
      },
    },
  },

  markdown: {
    //
    // ```mermaid ... ``` のコードブロックを
    // <img src="/mermaid/<hash>.svg"> に差し替える
    // （Markdownファイルは書き換えない。HTML生成時だけ差し替え）
    //
    config: md => {
      // front matter の title を先頭H1として注入（既にH1があれば何もしない）
      md.core.ruler.after('block', 'frontmatter-h1', (state: any) => {
        const fmTitle = state.env?.frontmatter?.title
        if (!fmTitle) return

        const hasH1 = state.tokens.some((t: any) => t.type === 'heading_open' && t.tag === 'h1')
        if (hasH1) return

        const Token = state.Token
        const open = new Token('heading_open', 'h1', 1)
        open.markup = '#'
        open.block = true

        const inline = new Token('inline', '', 0)
        inline.content = String(fmTitle)
        inline.children = []

        const close = new Token('heading_close', 'h1', -1)
        close.markup = '#'
        close.block = true

        // 文書の先頭に H1 を差し込む
        state.tokens.unshift(close)
        state.tokens.unshift(inline)
        state.tokens.unshift(open)
      })

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
