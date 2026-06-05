// Babel is only used by Jest (under NODE_ENV=test). Vite continues to use
// esbuild / @vitejs/plugin-react for dev and production builds.
module.exports = {
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
      plugins: ['./test/babel-plugin-import-meta-stub.cjs'],
    },
  },
}
