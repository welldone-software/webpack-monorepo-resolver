const WebpackMonorepoResolver = require('../../index')

module.exports = {
  context: __dirname,
  mode: 'production',
  entry: './src/fault.js',
  resolve: {
    plugins: [
      new WebpackMonorepoResolver()
    ],
    modules: [
      'src'
    ]
  },
}
