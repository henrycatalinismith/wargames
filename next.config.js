const webpack = require("webpack")

module.exports = {
  webpack: (config, { dev }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.GMAPS_API_KEY': JSON.stringify(process.env.GMAPS_API_KEY),
      })
    )
    return config
  },
  
  useFileSystemPublicRoutes: false,
}
