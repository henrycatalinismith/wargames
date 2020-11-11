const CopyPlugin = require("copy-webpack-plugin")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const path = require("path")

const devServer = {}
devServer.compress = true
devServer.contentBase = `${__dirname}/build`
devServer.port = 8080
devServer.writeToDisk = true

const entry = {}
entry.wargames = {}
entry.wargames.import = "./src/wargames.js"

const experiments = {}
experiments.topLevelAwait = true

const module_ = {}
module_.rules = []
module_.rules.push({
	test: /\.js$/,
	exclude: /node_modules/,
	use: ["babel-loader"]
})
module_.rules.push({
	test: /\.glsl$/,
	use: ["webpack-glsl-loader"]
})

const output = {}
output.filename = "src/[name].js"
output.path = `${__dirname}/build`

const plugins = []
// plugins.push(new BundleAnalyzerPlugin)

plugins.push(new CopyPlugin({
	patterns: [
		{
			from: "public/*",
			flatten: true,
		},
		{
			from: "images",
			to: "images",
		},
		{
			from: "vendor",
			to: "vendor",
			globOptions: {
				ignore: ["threex.atmospherematerial.js"],
			},
		},
		{
			from: "node_modules/three/build/three.min.js",
			to: "vendor/three.js",
		},
		{
			from: "node_modules/three/examples/js/controls/OrbitControls.js",
			to: "vendor/OrbitControls.js",
		},
	],
}))

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

