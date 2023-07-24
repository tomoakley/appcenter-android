const pkg = require('./package.json')
const importOrderPathRegexes = Object.keys(pkg._moduleAliases).map(
  (path) => `^${path}/(.*)$`
)

module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  useTabs: false,
  singleQuote: true,
  importOrder: [...importOrderPathRegexes, '^[./]'],
  importOrderSeparation: true,
  experimentalBabelParserPluginsList: [
    'jsx',
    'typescript',
    'classProperties',
    'throwExpressions',
    'exportDefaultFrom',
  ],
}

