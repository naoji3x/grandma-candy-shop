import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import * as crypto from 'crypto'
import { link } from 'fs'

const handbookItems = {
  ja: {
    text: 'handbook',
    collapsed: false,
    items: [
      {
        text: 'ガイドライン',
        collapsed: false,
        items: [
          { text: 'はじめに', link: '/ja/handbook/guidelines/README' },
          { text: 'ドキュメントの構成', link: '/ja/handbook/guidelines/docs-structure-guide' },
          { text: 'ドキュメントの内容', link: '/ja/handbook/guidelines/docs-contents-guide' },
          { text: 'ドキュメントの書き方', link: '/ja/handbook/guidelines/docs-editing-guide' },
        ],
      },
      {
        text: 'ルール',
        items: [
          {
            text: '共通',
            collapsed: true,
            items: [
              {
                text: 'ドキュメントID命名ルール',
                link: '/ja/handbook/rules/meta-id-naming-rules',
              },
              {
                text: 'メタ情報記述ルール',
                link: '/ja/handbook/rules/meta-document-metadata-rules',
              },
            ],
          },
          { text: 'プロジェクト' },
          {
            text: '業務仕様',
            collapsed: true,
            items: [
              {
                text: '概念データフロー図',
                items: [
                  { text: '全体ルール', link: '/ja/handbook/rules/cdfd-rules' },
                  { text: '図の記法ルール', link: '/ja/handbook/rules/cdfd-mermaid-rules' },
                ],
              },
              {
                text: 'データモデル',
                collapsed: true,
                items: [
                  { text: '業務データ辞書', link: '/ja/handbook/rules/bdd-rules' },
                  { text: '概念データストア一覧', link: '/ja/handbook/rules/cdsl-rules' },
                  { text: '保管場所一覧', link: '/ja/handbook/rules/sll-rules' },
                  { text: 'ステータス一覧', link: '/ja/handbook/rules/stl-rules' },
                  { text: '分類一覧', link: '/ja/handbook/rules/cll-rules' },
                  { text: '概念クラス図', link: '/ja/handbook/rules/ccd-mermaid-rules' },
                  { text: '概念状態遷移図', link: '/ja/handbook/rules/cstd-rules' },
                ],
              },
              {
                text: '業務モデル',
                collapsed: true,
                items: [
                  { text: '業務プロセス仕様', link: '/ja/handbook/rules/bps-rules' },
                  { text: 'ビジネスルール', link: '/ja/handbook/rules/br-rules' },
                  { text: '業務イベント一覧', link: '/ja/handbook/rules/bel-rules' },
                  { text: '業務イベント仕様', link: '/ja/handbook/rules/bev-rules' },
                ],
              },
              {
                text: 'インターフェースモデル',
                collapsed: true,
                items: [
                  { text: '画面仕様', link: '/ja/handbook/rules/uis-rules' },
                  { text: '帳票仕様', link: '/ja/handbook/rules/bds-rules' },
                ],
              },
              {
                text: '共通',
                collapsed: true,
                items: [
                  { text: 'システム化機能一覧', link: '/ja/handbook/rules/sfl-rules' },
                  { text: '用語集', link: '/ja/handbook/rules/gl-rules' },
                ],
              },
            ],
          },
          {
            text: '外部I/F仕様',
            collapsed: true,
            items: [
              { text: '外部システムI/F一覧', link: '/ja/handbook/rules/esil-rules' },
              { text: '外部API仕様', link: '/ja/handbook/rules/eapis-rules' },
              { text: '外部ファイル仕様', link: '/ja/handbook/rules/efes-rules' },
              { text: '外部メッセージ仕様', link: '/ja/handbook/rules/ems-rules' },
            ],
          },
          {
            text: 'アーキテクチャ',
            collapsed: true,
            items: [
              {
                text: 'C4',
                items: [
                  { text: 'コンテキスト図', link: '/ja/handbook/rules/cxd-rules' },
                  { text: 'コンテナ図', link: '/ja/handbook/rules/cnd-rules' },
                  { text: 'コンポーネント図', link: '/ja/handbook/rules/cpd-rules' },
                ],
              },
              {
                text: 'インフラ・技術選定',
                items: [
                  { text: 'インフラ構成図', link: '/ja/handbook/rules/ifd-rules' },
                  { text: '技術スタック一覧', link: '/ja/handbook/rules/tsl-rules' },
                ],
              },
            ],
          },
          { text: 'システム設計' },
          { text: '業務受入条件', link: '/ja/handbook/rules/bac-rules' },
          { text: '非機能要件', link: '/ja/handbook/rules/nfr-rules' },
          { text: 'システム受入条件', link: '/ja/handbook/rules/sac-rules' },
          {
            text: 'テスト',
            collapsed: true,
            items: [
              { text: 'テスト戦略・方針', link: '/ja/handbook/rules/tsp-rules' },
              { text: 'テスト観点・条件', link: '/ja/handbook/rules/tpc-rules' },
              {
                text: '単体テスト',
                collapsed: true,
                items: [
                  { text: '単体テスト仕様', link: '/ja/handbook/rules/uts-rules' },
                  { text: '単体テスト個別仕様', link: '/ja/handbook/rules/uts-detailed-rules' },
                  { text: '単体テスト設計', link: '/ja/handbook/rules/utd-rules' },
                  { text: '単体テスト個別設計', link: '/ja/handbook/rules/utd-detailed-rules' },
                ],
              },
              {
                text: '内部結合テスト',
                collapsed: true,
                items: [
                  { text: '内部結合テスト仕様', link: '/ja/handbook/rules/its-rules' },
                  { text: '内部結合テスト個別仕様', link: '/ja/handbook/rules/its-detailed-rules' },
                  { text: '内部結合テスト設計', link: '/ja/handbook/rules/itd-rules' },
                  { text: '内部結合テスト個別設計', link: '/ja/handbook/rules/itd-detailed-rules' },
                ],
              },
              {
                text: '外部結合テスト',
                collapsed: true,
                items: [
                  { text: '外部結合テスト仕様', link: '/ja/handbook/rules/ets-rules' },
                  { text: '外部結合テスト個別仕様', link: '/ja/handbook/rules/ets-detailed-rules' },
                  { text: '外部結合テスト設計', link: '/ja/handbook/rules/etd-rules' },
                  { text: '外部結合テスト個別設計', link: '/ja/handbook/rules/etd-detailed-rules' },
                ],
              },
              {
                text: '総合テスト',
                collapsed: true,
                items: [
                  { text: '総合テスト仕様', link: '/ja/handbook/rules/sts-rules' },
                  { text: '総合テスト個別仕様', link: '/ja/handbook/rules/sts-detailed-rules' },
                  { text: '総合テスト設計', link: '/ja/handbook/rules/std-rules' },
                  { text: '総合テスト個別設計', link: '/ja/handbook/rules/std-detailed-rules' },
                ],
              },
              {
                text: '受入テスト',
                collapsed: true,
                items: [
                  { text: '受入テスト仕様', link: '/ja/handbook/rules/ats-rules' },
                  { text: '受入テスト個別仕様', link: '/ja/handbook/rules/ats-detailed-rules' },
                  { text: '受入テスト設計', link: '/ja/handbook/rules/atd-rules' },
                  { text: '受入テスト個別設計', link: '/ja/handbook/rules/atd-detailed-rules' },
                ],
              },
            ],
          },
          { text: '移行' },
          { text: '運用' },
        ],
      },
      {
        text: '指示テンプレート',
        collapsed: true,
        items: [
          { text: 'プロジェクト' },
          {
            text: '業務仕様',
            collapsed: true,
            items: [
              { text: '概念データフロー図', link: '/ja/handbook/instructions/cdfd-instruction' },
              {
                text: 'データモデル',
                collapsed: true,
                items: [
                  { text: '業務データ辞書', link: '/ja/handbook/instructions/bdd-instruction' },
                  {
                    text: '概念データストア一覧',
                    link: '/ja/handbook/instructions/cdsl-instruction',
                  },
                  { text: '保管場所一覧', link: '/ja/handbook/instructions/sll-instruction' },
                  { text: 'ステータス一覧', link: '/ja/handbook/instructions/stl-instruction' },
                  { text: '分類一覧', link: '/ja/handbook/instructions/cll-instruction' },
                  {
                    text: '概念クラス図',
                    link: '/ja/handbook/instructions/ccd-mermaid-instruction',
                  },
                  { text: '概念状態遷移図', link: '/ja/handbook/instructions/cstd-instruction' },
                ],
              },
              {
                text: '業務モデル',
                collapsed: true,
                items: [
                  { text: '業務プロセス仕様', link: '/ja/handbook/instructions/bps-instruction' },
                  { text: 'ビジネスルール', link: '/ja/handbook/instructions/br-instruction' },
                  { text: '業務イベント一覧', link: '/ja/handbook/instructions/bel-instruction' },
                  { text: '業務イベント仕様', link: '/ja/handbook/instructions/bev-instruction' },
                ],
              },
              {
                text: 'インターフェースモデル',
                collapsed: true,
                items: [
                  { text: '画面仕様', link: '/ja/handbook/instructions/uis-instruction' },
                  { text: '帳票仕様', link: '/ja/handbook/instructions/bds-instruction' },
                ],
              },
              {
                text: '共通',
                collapsed: true,
                items: [
                  { text: 'システム化機能一覧', link: '/ja/handbook/instructions/sfl-instruction' },
                  { text: '用語集', link: '/ja/handbook/instructions/gl-instruction' },
                ],
              },
            ],
          },
          {
            text: '外部I/F仕様',
            collapsed: true,
            items: [
              { text: '外部システムI/F一覧', link: '/ja/handbook/instructions/esil-instruction' },
              { text: '外部API仕様', link: '/ja/handbook/instructions/eapis-instruction' },
              { text: '外部ファイル仕様', link: '/ja/handbook/instructions/efes-instruction' },
              { text: '外部メッセージ仕様', link: '/ja/handbook/instructions/ems-instruction' },
            ],
          },
          {
            text: 'アーキテクチャ',
            collapsed: true,
            items: [
              {
                text: 'C4',
                items: [
                  { text: 'コンテキスト図', link: '/ja/handbook/instructions/cxd-instruction' },
                  { text: 'コンテナ図', link: '/ja/handbook/instructions/cnd-instruction' },
                  { text: 'コンポーネント図', link: '/ja/handbook/instructions/cpd-instruction' },
                ],
              },
              {
                text: 'インフラ・技術選定',
                items: [
                  { text: 'インフラ構成図', link: '/ja/handbook/instructions/ifd-instruction' },
                  { text: '技術スタック一覧', link: '/ja/handbook/instructions/tsl-instruction' },
                ],
              },
            ],
          },
          { text: 'システム設計' },
          { text: '業務受入条件', link: '/ja/handbook/instructions/bac-instruction' },
          { text: '非機能要件', link: '/ja/handbook/instructions/nfr-instruction' },
          { text: 'システム受入条件', link: '/ja/handbook/instructions/sac-instruction' },
          {
            text: 'テスト',
            collapsed: true,
            items: [
              { text: 'テスト戦略・方針', link: '/ja/handbook/instructions/tsp-instruction' },
              { text: 'テスト観点・条件', link: '/ja/handbook/instructions/tpc-instruction' },
              {
                text: '単体テスト',
                collapsed: true,
                items: [
                  { text: '単体テスト仕様', link: '/ja/handbook/instructions/uts-instruction' },
                  {
                    text: '単体テスト個別仕様',
                    link: '/ja/handbook/instructions/uts-detailed-instruction',
                  },
                  { text: '単体テスト設計', link: '/ja/handbook/instructions/utd-instruction' },
                  {
                    text: '単体テスト個別設計',
                    link: '/ja/handbook/instructions/utd-detailed-instruction',
                  },
                ],
              },
              {
                text: '内部結合テスト',
                collapsed: true,
                items: [
                  { text: '内部結合テスト仕様', link: '/ja/handbook/instructions/its-instruction' },
                  {
                    text: '内部結合テスト個別仕様',
                    link: '/ja/handbook/instructions/its-detailed-instruction',
                  },
                  { text: '内部結合テスト設計', link: '/ja/handbook/instructions/itd-instruction' },
                  {
                    text: '内部結合テスト個別設計',
                    link: '/ja/handbook/instructions/itd-detailed-instruction',
                  },
                ],
              },
              {
                text: '外部結合テスト',
                collapsed: true,
                items: [
                  { text: '外部結合テスト仕様', link: '/ja/handbook/instructions/ets-instruction' },
                  {
                    text: '外部結合テスト個別仕様',
                    link: '/ja/handbook/instructions/ets-detailed-instruction',
                  },
                  { text: '外部結合テスト設計', link: '/ja/handbook/instructions/etd-instruction' },
                  {
                    text: '外部結合テスト個別設計',
                    link: '/ja/handbook/instructions/etd-detailed-instruction',
                  },
                ],
              },
              {
                text: '総合テスト',
                collapsed: true,
                items: [
                  { text: '総合テスト仕様', link: '/ja/handbook/instructions/sts-instruction' },
                  {
                    text: '総合テスト個別仕様',
                    link: '/ja/handbook/instructions/sts-detailed-instruction',
                  },
                  { text: '総合テスト設計', link: '/ja/handbook/instructions/std-instruction' },
                  {
                    text: '総合テスト個別設計',
                    link: '/ja/handbook/instructions/std-detailed-instruction',
                  },
                ],
              },
              {
                text: '受入テスト',
                collapsed: true,
                items: [
                  { text: '受入テスト仕様', link: '/ja/handbook/instructions/ats-instruction' },
                  {
                    text: '受入テスト個別仕様',
                    link: '/ja/handbook/instructions/ats-detailed-instruction',
                  },
                  { text: '受入テスト設計', link: '/ja/handbook/instructions/atd-instruction' },
                  {
                    text: '受入テスト個別設計',
                    link: '/ja/handbook/instructions/atd-detailed-instruction',
                  },
                ],
              },
            ],
          },
          { text: '移行' },
          { text: '運用' },
        ],
      },
    ],
  },
}

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

const isHandbookTop = (item: SidebarItem): boolean => {
  const link = item.link ?? ''
  return link.includes('/handbook/') || (item.text ?? '').toString().toLowerCase() === 'handbook'
}

// 再帰的に: 表示名整形（xxx-削除）、並び替え
const transformSidebar = (items: SidebarItem[], locale: Locale): SidebarItem[] => {
  const transformed = items
    .filter(it => !isHandbookTop(it)) // handbook トップは自動生成側に含めない
    .map(it => {
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

const sidebarJaAuto = makeSidebar('ja')
const sidebarEnAuto = makeSidebar('en')

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
        sidebar: [handbookItems.ja, ...sidebarJaAuto],
        langMenuLabel: '言語',
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        sidebar: sidebarEnAuto,
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
