module.exports = {
  root: true,
  plugins: ['mdx'],
  overrides: [
    // 通常の TS/JS の設定は省略…
    {
      files: ['**/*.md', '**/*.mdx'],
      extends: ['plugin:mdx/recommended'], // MD/MDX向け既定
      processor: 'mdx/remark', // ← これで remark が走る
    },
  ],
}
