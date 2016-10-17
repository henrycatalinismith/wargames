var path = require('path');

module.exports = {
  entry: path.join(__dirname, '_scripts', 'index.js'),
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  },
  output: {
    filename: 'app.js'
  },
  resolve: {
    root: path.join(__dirname, '_scripts')
  },
  alias: {
  // Force all modules to use versions of backbone and underscore defined
  // in package.json to prevent duplicate dependencies
  'backbone': path.join(__dirname, 'node_modules', 'backbone', 'backbone.js'),
  'underscore': path.join(__dirname, 'node_modules', 'underscore', 'underscore.js')
  }
}
