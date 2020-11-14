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

  eleventyConfig.addPlugin(require("./_11ty/html.js"))
  eleventyConfig.addPlugin(require("./_11ty/sass.js"))

  const dir = {
    includes: "_html",
  }

  return { dir }
}

