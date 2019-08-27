const path = require('path')

module.exports = {
  context: path.resolve(__dirname, 'projects', 'main-project'),
  mode: 'production',
  entry: './src/index.js',
  resolve: {
    modules: [
      'src',
      'node_modules'
    ]
  },
}
