import fs from 'fs'

const input = fs.readFileSync(0, 'utf8')

function isDelimiterCell(cell: string): boolean {
  return /^:?-+:?:?$/.test(cell.trim())
}

function normalizeDelimiterCell(cell: string): string {
  const c = cell.trim()
  const left = c.startsWith(':')
  const right = c.endsWith(':')
  if (left && right) return ':---:'
  if (left) return ':---'
  if (right) return '---:'
  return '---'
}

function splitRow(line: string) {
  const indent = line.match(/^\s*/)?.[0] ?? ''
  const inner = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  const cells = inner.split('|')
  return { indent, cells }
}

function normalizeTable(block: string): string {
  const lines = block.split(/\r?\n/)

  if (lines.length < 2) return block

  if (!lines[1] || !lines[1].includes('-')) return block

  const out: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const { indent, cells } = splitRow(lines[i])

    if (i === 1 && cells.every(isDelimiterCell)) {
      const norm = cells.map(normalizeDelimiterCell)
      out.push(`${indent}| ${norm.join(' | ')} |`)
    } else {
      const norm = cells.map(c => c.trim())
      out.push(`${indent}| ${norm.join(' | ')} |`)
    }
  }

  return out.join('\n')
}

process.stdout.write(normalizeTable(input))
