const ignore = []
ignore.push("node_modules")

const plugins = []
plugins.push("@babel/plugin-proposal-class-properties")
plugins.push("@babel/plugin-transform-runtime")

const presets = []
presets.push("@babel/preset-env")

module.exports = {
  ignore,
  plugins,
  presets,
}
