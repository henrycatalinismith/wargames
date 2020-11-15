function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function initDependencies() {
  window.dependencies = [
    "images/day.jpg",
    "images/night.jpg",
    "images/space.jpg",
    "missiles/000.json",
    "vendor/d3-array.js",
    "vendor/d3-geo.js",
    "vendor/three.js",
    "vendor/OrbitControls.js",
    "src/wargames.js",
  ].map(name => {
    return {
      name,
      loaded: false,
      payload: undefined,
    }
  })
}

function injectDependencies() {
  window.dependencies.forEach(async d => {
    let i = 0
    if (d.name.endsWith("js")) {
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.text = d.payload
      document.body.appendChild(script)
    } else if (d.name.endsWith("json")) {
      window.missileQueue = JSON.parse(d.payload)
    } else {
      // window[d.name] = URL.createObjectURL(d.payload)
      const arr = new Uint8Array(d.payload)
      let raw = ''
      let j = arr.length
      for (i = 0; i < j; i += 5000) {
        raw += String.fromCharCode.apply(
          null,
          arr.subarray(i, i + 5000),
        );
      }
      window[d.name] = `data:image/jpeg;base64,${btoa(raw)}`
    }
  })
}

async function loadDependencies() {
  await Promise.all(window.dependencies.map(loadDependency))
}

function loadDependency(dependency) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest
    request.open("GET", dependency.name)
    if (dependency.name.endsWith("jpg")) {
      request.responseType = "arraybuffer"
      // request.responseType = "blob"
    }
    request.onload = () => {
      dependency.loaded = true
      dependency.payload = request.response
      updateProgressBar()
      resolve()
    }
    request.send()
  })
}

function updateProgressBar() {
  const total = dependencies.length
  const loaded = dependencies.filter(d => d.loaded).length
  const progress = Math.min(loaded / total, 1)
  const progressBar = document.querySelector("[aria-label='loading'] path")
  progressBar.style.strokeDashoffset = 128 - (
    128 * progress
  )
}

async function loadDemo() {
  const style = getComputedStyle(document.body)
  const loadingTransitionProperty = style.getPropertyValue(
    "--loadingTransitionDuration"
  )
  const loadingTransitionDuration = parseInt(
    loadingTransitionProperty,
    10,
  )

  const button = document.querySelector("button")
  button.addEventListener("click", loadDemo)

  document.body.dataset.mode = "load"
  initDependencies()
  await loadDependencies()
  await delay(loadingTransitionDuration * 2)
  injectDependencies()
  document.body.dataset.mode = "play"
  button.removeEventListener("click", loadDemo)
}

function arrayBufferToBase64(buffer) {
  let binary = ""
  const bytes = [].slice.call(new Uint8Array(buffer))
  bytes.forEach((b) => binary += String.fromCharCode(b))
  return window.btoa(binary)
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("button")
  button.addEventListener("click", loadDemo)

  const image = document.querySelector("[itemprop='image']")
  fetch("/images/square.png")
    .then(response => response.arrayBuffer())
    .then(buffer => image.src = `data:image/jpeg;base64,${arrayBufferToBase64(buffer)}`)
})

