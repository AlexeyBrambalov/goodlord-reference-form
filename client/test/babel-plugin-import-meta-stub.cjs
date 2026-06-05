// Test-only Babel plugin: replaces `import.meta` with `{ env: {} }` so modules
// that read `import.meta.env` (Vite) can be required under Jest/CommonJS.
// Inherits the syntax plugin so `import.meta` parses in the first place.
module.exports = function importMetaStub({ types: t }) {
  return {
    name: 'import-meta-stub',
    inherits: require('@babel/plugin-syntax-import-meta').default,
    visitor: {
      MetaProperty(path) {
        path.replaceWith(
          t.objectExpression([
            t.objectProperty(t.identifier('env'), t.objectExpression([])),
          ]),
        )
      },
    },
  }
}
