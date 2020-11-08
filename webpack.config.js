const path = require("path")

module.exports = {
	devServer: {
    contentBase: __dirname,
    compress: true,
    port: 8080,
  },

  entry: "./index.js",

  output: {
    filename: "wargames.js",
    path: __dirname,
  },

	watch: true,
}

