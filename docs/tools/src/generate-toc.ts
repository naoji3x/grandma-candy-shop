import { readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const rootDir = 'docs'
const outFile = 'docs/index.md'

function walk(dir: string, prefix = ''): string {
  const items = readdirSync(dir, { withFileTypes: true })

  let result = ''

  for (const item of items) {
    const fullPath = join(dir, item.name)
    const isDir = item.isDirectory()

    if (isDir) {
      result += `${prefix}- **${item.name}/**\n`
      result += walk(fullPath, prefix + '  ')
    } else if (item.name.endsWith('.md')) {
      const relativePath = fullPath.replace(/^docs\//, '')
      const filename = item.name.replace('.md', '')
      result += `${prefix}- [${filename}](${relativePath})\n`
    }
  }

  return result
}

const content = `# 📁 docs ツリー一覧\n\n${walk(rootDir)}`
writeFileSync(outFile, content, { encoding: 'utf8' })

console.log('✨ 生成完了: docs/index.md')
