export default {
  plugins: [
    'remark-parse',
    ['remark-frontmatter', ['yaml']],
    ['remark-lint-frontmatter-schema', { schema: 'schemas/spec-frontmatter.schema.json' }],
  ],
}
