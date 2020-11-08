const path = require("path")

module.exports = {
	devServer: {
    contentBase: __dirname,
    compress: true,
    port: 8080,
  },

  entry: "./index.js",

	module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },

  output: {
    filename: "wargames.js",
    path: __dirname,
  },

  resolve: {
    extensions: ["*", ".js"]
  },

	watch: true,
}

