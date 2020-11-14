const fs = require("fs-extra")
const htmlmin = require("html-minifier")
const { JSDOM } = require("jsdom")
const version = require("../_data/version")

const initArguments = {}

async function configFunction(eleventyConfig) {
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
}

module.exports = {
  initArguments,
  configFunction,
}

