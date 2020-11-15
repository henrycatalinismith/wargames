const CleanCSS = require("clean-css")
const fs = require("fs-extra")
const htmlmin = require("html-minifier")
const { JSDOM } = require("jsdom")
const sass = require("sass")
const { minify } = require("terser")
const version = require("./_data/version")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("images")
  eleventyConfig.addPassthroughCopy("missiles")
  eleventyConfig.addPassthroughCopy("src")
  eleventyConfig.addPassthroughCopy({
    "node_modules/three/examples/js/controls/OrbitControls.js": "vendor/OrbitControls.js",
  })
  eleventyConfig.addPassthroughCopy({
    "node_modules/d3-array/dist/d3-array.min.js": "vendor/d3-array.js",
  })
  eleventyConfig.addPassthroughCopy({
    "node_modules/d3-geo/dist/d3-geo.min.js": "vendor/d3-geo.js",
  })
  eleventyConfig.addPassthroughCopy({
    "node_modules/three/build/three.min.js": "vendor/three.js",
  })

  eleventyConfig.addTransform(
    "htmlmin",
    function(content, outputPath) {
      if (outputPath && outputPath.endsWith(".html")) {
        const dom = new JSDOM(content)

        // const style = dom.window.document.createElement("style")
        // style.type = "text/css"
        // style.innerHTML = fs.readFileSync(`_site/style-${version}.css`, "utf-8")
        // dom.window.document.head.appendChild(style)

        //const pictures = dom.window.document.querySelectorAll("p > picture")

        //for (const p of pictures) {
          //p.parentElement.replaceWith(p)
        //}

        const html = dom.serialize()

        return htmlmin.minify(html, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true
        })
      }
      return content
    }
  )

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

  eleventyConfig.addNunjucksAsyncFilter(
    "terser",
    function(js, callback) {
      minify(js).then(({ code }) => callback(null, code))
    }
  )

  eleventyConfig.addWatchTarget("./style.scss")

  const dir = {
    includes: "_html",
  }

  return { dir }
}

