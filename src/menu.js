function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const progressBar = document.querySelector("path")

function initDependencies() {
  window.dependencies = Object.entries(window.dependencies).map(([name, size]) => {
    console.log(name, size)
    return {
      name,
      size,
      loaded: 0,
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
      console.log(d.name)
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
    console.log(dependency)
    if (dependency.name.endsWith("jpg")) {
      request.responseType = "arraybuffer"
      // request.responseType = "blob"
    }
    request.onprogress = pe => {
      dependency.loaded = pe.loaded
      updateProgressBar()
    }
    request.onload = () => {
      dependency.loaded = dependency.size
      dependency.payload = request.response
      updateProgressBar()
      resolve()
    }
    request.send()
  })
}

function updateProgressBar() {
  const total = dependencies.reduce((a, c) => a + c.size, 0)
  const loaded = dependencies.reduce((a, c) => a + c.loaded, 0)
  const progress = Math.min(loaded / total, 1)
  progressBar.style.strokeDashoffset = 128 - (
    128 * progress
  )
}

const style = getComputedStyle(document.body)
const loadingTransitionProperty = style.getPropertyValue(
  "--loadingTransitionDuration"
)
const loadingTransitionDuration = parseInt(
  loadingTransitionProperty,
  10,
)

initDependencies()
await loadDependencies()
await delay(loadingTransitionDuration * 2)
injectDependencies()
document.body.dataset.mode = "play"

