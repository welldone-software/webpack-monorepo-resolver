const path = require('path')
const WebpackMonorepoResolver = require('../../index')

module.exports = {
  context: path.resolve(__dirname, 'projects', 'main-project'),
  mode: 'production',
  entry: './src/index.js',
  resolve: {
    plugins: [
      new WebpackMonorepoResolver()
    ],
    modules: [
      'src',
      'node_modules',
      '..'
    ]
  },
}
