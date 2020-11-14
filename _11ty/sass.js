const CleanCSS = require("clean-css")
const sass = require("sass")

const initArguments = {}

async function configFunction(eleventyConfig) {
  eleventyConfig.addFilter(
    "scss",
    function(scss) {
      let css = sass.renderSync({
        data: scss,
      }).css
      css = new CleanCSS({}).minify(css).styles
      return css
    }
  )
}

module.exports = {
  initArguments,
  configFunction,
}
