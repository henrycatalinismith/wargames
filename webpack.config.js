const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")

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

const optimization = {}
optimization.minimizer = [new TerserPlugin({
  extractComments: false,
  parallel: true,
  terserOptions: {
    sourceMap: true,
  },
})]

const output = {}
output.filename = "src/[name].js"
output.path = `${__dirname}/build`

const performance = {}
performance.assetFilter = function(assetFilename) {
  if (assetFilename === "vendor/three.js") {
    // Stop nagging me about three.js being huge. I've tried building a custom
    // bundle to make it smaller and it doesn't help. It's just big.
    return false
  }
  return true
}

const plugins = []
// plugins.push(new BundleAnalyzerPlugin)

plugins.push(new CleanWebpackPlugin({
  verbose: false,
}))

plugins.push(new CopyPlugin({
  patterns: [
    {
      from: "public/*",
      flatten: true,
    },
    {
      from: "images",
      to: "images",
      globOptions: {
        ignore: [
          "**/screenshot.png",
        ],
      },
    },
    {
      from: "missiles",
      to: "missiles",
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

module.exports = {
  devServer,
  entry,
  experiments,
  module: module_,
  optimization,
  output,
  performance,
  plugins,
  resolve,
}

