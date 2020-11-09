const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const path = require("path")

const devServer = {}
devServer.contentBase == __dirname
devServer.compress = true
devServer.port = 8080

const entry = {}
entry.wargames = {}
entry.wargames.import = "./index.js"

const experiments = {}
experiments.topLevelAwait = true

const module_ = {}
module_.rules = []
module_.rules.push({
	test: /\.(js)$/,
	exclude: /node_modules/,
	use: ["babel-loader"]
})

const output = {}
output.filename = "[name].bundle.js"
output.path = __dirname

const plugins = []
// plugins.push(new BundleAnalyzerPlugin)

const resolve = {}
resolve.extensions = []
resolve.extensions.push("*")
resolve.extensions.push(".js")

const watch = process.argv.includes("serve")

module.exports = {
	devServer,
  entry,
	experiments,
	module: module_,
  output,
	plugins,
  resolve,
	watch,
}

