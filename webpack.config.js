const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream'),
    },
  },
  Plugins: [
    new NodePolyfillPlugin()
  ]
}