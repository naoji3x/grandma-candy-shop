// docs/tools/src/remark-table-delim-3.cjs
// remarkの実行中にVFileの内容を書き換えて、テーブル区切り行だけ `---` に正規化する
// docs/tools/src/remark-table-delim-3.cjs
//
// 以下、うまく結果が出なかったが、念のため残しておく。fmt-md.tsで解消。
//
console.log('[remark-table-delim-3] loaded')

module.exports = function remarkTableDelimiterThree() {
  return function (_, file) {
    const input = String(file.value ?? '')
    if (!input) return

    const lines = input.split(/\r?\n/)
    let changed = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.includes('|') || !line.includes('-')) continue

      const trimmed = line.trim()

      // 区切り行に使われる文字以外が混ざってたらスキップ（誤爆防止）
      if (!/^[\s|:-]+$/.test(trimmed)) continue

      // 両端の|があってもなくても扱えるように
      const rawCells = trimmed.replace(/^\|/, '').replace(/\|$/, '').split('|')
      const cells = rawCells.map(c => c.trim())
      if (cells.length < 2) continue

      // 全セルが delimiter っぽいか確認
      if (!cells.every(c => /^:?-+:?:?$/.test(c))) continue

      const normalized = cells.map(cell => {
        const left = cell.startsWith(':')
        const right = cell.endsWith(':')
        if (left && right) return ':---:'
        if (left) return ':---'
        if (right) return '---:'
        return '---'
      })

      const hasLeadingPipe = /^\s*\|/.test(line)
      const hasTrailingPipe = /\|\s*$/.test(line)
      const indent = line.match(/^\s*/)?.[0] ?? ''

      const rebuilt =
        (hasLeadingPipe ? '| ' : '') + normalized.join(' | ') + (hasTrailingPipe ? ' |' : '')

      const outLine = indent + rebuilt
      if (outLine !== line) {
        console.log(`[remark-table-delim-3] line ${i + 1} updated: "${line}" => "${outLine}"`)
        lines[i] = outLine
        changed = true
      }
    }

    if (changed) file.value = lines.join('\n')
  }
}
