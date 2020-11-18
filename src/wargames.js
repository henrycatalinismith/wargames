const atmosphereShader = {}
const sunlightShader = {}

atmosphereShader.fragment = `
uniform vec3 glowColor;
uniform float coeficient;
uniform float power;

varying vec3 vVertexNormal;
varying vec3 vVertexWorldPosition;

//varying vec4 vFragColor;

void main(){
  vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;
  vec3 viewCameraToVertex = (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;
  viewCameraToVertex = normalize(viewCameraToVertex);
  float intensity = pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);
  gl_FragColor = vec4(glowColor, intensity);
}`,

atmosphereShader.vertex = `
varying vec3 vVertexWorldPosition;
varying vec3 vVertexNormal;
varying vec4 vFragColor;

void main(){
  vVertexNormal = normalize(normalMatrix * normal);
  vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

sunlightShader.fragment = `
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform vec3 sunDirection;
varying vec2 vUv;
varying vec3 vNormal;

void main(void) {
  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;
  float cosineAngleSunToNormal = dot(normalize(vNormal), sunDirection);
  cosineAngleSunToNormal = clamp(cosineAngleSunToNormal * 5.0, -1.0, 1.0);
  float mixAmount = cosineAngleSunToNormal * 0.5 + 0.5;
  vec3 color = mix(nightColor, dayColor, mixAmount);
  gl_FragColor = vec4(color, 1.0);
}
`

sunlightShader.vertex = `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * mvPosition;
}
`

function initRenderer() {
  window.renderer = new THREE.WebGLRenderer
  window.renderer.setClearColor(0x000000, 1.0)
  window.renderer.setPixelRatio(window.devicePixelRatio)
  window.renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(window.renderer.domElement)
}

function initScenery() {
  window.scenery = new THREE.Object3D
}

function initScene() {
  window.scene = new THREE.Scene
  window.scene.add(new THREE.AmbientLight(0xffffff))
  window.scene.add(new THREE.AmbientLight(0xffffff))
  window.scene.add(window.scenery)
}

function initCamera() {
  window.camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    100,
  )
  window.camera.position.x = 0
  window.camera.position.y = 0
  window.camera.position.z = 3

  if (window.innerWidth > 512 && window.innerHeight > 512) {
    window.camera.position.z = 2
  }
}

function initSun() {
  window.sun = {}
  sun.direction = new THREE.Vector3(
    1.25,
    0,
    0.5,
  )
}

async function initEarth() {
  const day = await loadTexture("images/day.jpg")
  const night = await loadTexture("images/night.jpg")

  window.earth = {}
  window.earth.radius = 0.5
  window.earth.segments = 64

  window.earth.geometry = new THREE.SphereGeometry(
    window.earth.radius,
    window.earth.segments,
    window.earth.segments,
  )

  window.earth.material = new THREE.ShaderMaterial({
    uniforms: {
      sunDirection: {
        value: sun.direction,
      },
      dayTexture: {
        value: day,
      },
      nightTexture: {
        value: night,
      }
    },
    vertexShader: sunlightShader.vertex,
    fragmentShader: sunlightShader.fragment,
  })

  window.earth.mesh = new THREE.Mesh(
    window.earth.geometry,
    window.earth.material,
  )

  window.scenery.add(window.earth.mesh)
}

function initInnerAtmosphere() {
  window.innerAtmosphere = {}
  window.innerAtmosphere.material = new THREE.ShaderMaterial({
    uniforms: {
      coeficient: {
        type: "f",
        value: 1.0
      },
      power: {
        type: "f",
        value: 5
      },
      glowColor: {
        type: "c",
        value: new THREE.Color(0x88ffff),
      },
    },
    vertexShader: atmosphereShader.vertex,
    fragmentShader: atmosphereShader.fragment,
    transparent: true,
    depthWrite: false,
  })
  window.innerAtmosphere.mesh = new THREE.Mesh(
    window.earth.geometry.clone(),
    window.innerAtmosphere.material
  )
  window.innerAtmosphere.mesh.scale.multiplyScalar(1.008)
  window.earth.mesh.add(window.innerAtmosphere.mesh)
}

function initOuterAtmosphere() {
  window.outerAtmosphere = {}
  window.outerAtmosphere.material = new THREE.ShaderMaterial({
    uniforms: {
      coeficient: {
        type: "f",
        value: 0.68,
      },
      power: {
        type: "f",
        value: 10,
      },
      glowColor: {
        type: "c",
        value: new THREE.Color(0x0088ff),
      },
    },
    side: THREE.BackSide,
    vertexShader: atmosphereShader.vertex,
    fragmentShader: atmosphereShader.fragment,
    transparent: true,
    depthWrite: false,
  })
  window.outerAtmosphere.mesh = new THREE.Mesh(
    window.earth.geometry.clone(),
    window.outerAtmosphere.material
  )
  window.outerAtmosphere.mesh.scale.multiplyScalar(1.06)
  window.earth.mesh.add(window.outerAtmosphere.mesh)
}

async function initSpace() {
  const skyTexture = await loadTexture("images/space.jpg")
  window.space = {}
  window.space.geometry = new THREE.SphereGeometry(
    2,
    64,
    64,
  )
  window.space.material = new THREE.MeshPhongMaterial({
    opacity: 0.5,
    side: THREE.BackSide,
    shininess: 0.4,
    transparent: true,
  })
  window.space.material.map = skyTexture
  window.space.material.needsUpdate = true
  window.space.mesh = new THREE.Mesh(
    window.space.geometry,
    window.space.material,
  )
  window.scenery.add(window.space.mesh)
}

function initConflict() {
  window.conflict = {}
  window.conflict.material = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    opacity: 0.5,
    transparent: true,
    color: 0xe43c59,
  })
  window.conflict.mesh = new THREE.Mesh()
  window.scenery.add(window.conflict.mesh)
}

function initMissiles() {
  window.missileCooldownDelay = Math.pow(2, 5)
  window.missileCooldownActive = false
  window.missileCooldownTimeout = undefined
  window.missileLimit = Math.pow(2, 9)
  window.missileTotal = window.missileQueue.length // TODO: chunks
  window.missileCount = 0
  window.missiles = []

  launchMissiles()
}

function launchMissiles() {
  const missilesNeeded = window.missileLimit - window.missiles.length
  const missilesAvailable = window.missileQueue.length / 4
  const missilesToLaunch = Math.min(missilesNeeded, missilesAvailable)

  if (window.missileCooldownActive) {
    return
  }

  if (missilesNeeded > missilesAvailable) {
    console.log("missile stock depleted")
  }

  if (missilesToLaunch > 0) {
    launchMissile()
  }

  window.missileCooldownActive = true
  window.clearTimeout(window.missileCooldownTimeout)
  window.missileCooldownTimeout = window.setTimeout(
    () => window.missileCooldownActive = false,
    window.missileCooldownDelay,
  )
}

function launchMissile() {
  const [lat1, lon1, lat2, lon2] = window.missileQueue.splice(0, 4)
  const missile = {}

  missile.curveSegments = 128
  missile.tubeRadiusSegments = 2
  missile.tubeDefaultRadius = 0.005
  missile.drawRangeDelta = 16
  missile.maxDrawRange = missile.drawRangeDelta * missile.curveSegments

  missile.spline = spline(lat1, lon1, lat2, lon2)
  missile.speed = 16 / missile.spline.getLength()

  missile.geometry = new THREE.TubeBufferGeometry(
    missile.spline,
    missile.curveSegments,
    missile.tubeDefaultRadius,
    missile.tubeRadiusSegments,
    false
  )
  missile.geometry.setDrawRange(0, 0)

  missile.mesh = new THREE.Mesh(
    missile.geometry,
    window.conflict.material,
  )

  window.conflict.mesh.add(missile.mesh)
  window.missiles.push(missile)
  window.missileCount += 1

  updateProgressBar()
}

function updateMissiles() {
  for (const m in window.missiles) {
    const missile = window.missiles[m]
    let { start, count } = missile.geometry.drawRange

    if (count < missile.maxDrawRange) {
      count = Math.min(
        missile.maxDrawRange,
        count + missile.speed,
      )
    } else if (start < missile.maxDrawRange) {
      start = Math.min(
        missile.maxDrawRange,
        start + 33,
      )
    } else {
      window.conflict.mesh.remove(missile)
      missile.geometry.dispose()
      window.missiles.splice(m, 1)
      continue
    }

    missile.geometry.setDrawRange(start, count)
  }

  launchMissiles()
}

function initAxes() {
  window.axes = new THREE.AxesHelper(window.earth.radius * 1.2)
  window.scenery.add(window.axes)
}

function initControls() {
  window.controls = new THREE.OrbitControls(
    window.camera,
    window.renderer.domElement,
  )
  window.controls.autoRotate = true
  window.controls.autoRotateSpeed = -0.9
  window.controls.dampingFactor = 0.5
  window.controls.enableDamping = true
  window.controls.enablePan = false
  window.controls.maxDistance = 3
  window.controls.minDistance = 2
  controls.target = new THREE.Vector3(0, 0.1, 0)
}

window.startAnimation = function() {
  window.animationRequest = requestAnimationFrame(window.updateAnimation)
}

window.updateAnimation = function() {
  updateMissiles()
  // scenery.rotation.y -= 0.001
  // sunDirection.x += 0.005
  window.controls.update()
  window.renderer.render(window.scene, window.camera)

  window.animationRequest = requestAnimationFrame(window.updateAnimation)
}

function pos(lat, lng, radius) {
  const φ = (90 - lat) * Math.PI / 180
  const θ = (lng + 180) * Math.PI / 180
  return new THREE.Vector3(
    - radius * Math.sin(φ) * Math.cos(θ),
    radius * Math.cos(φ),
    radius * Math.sin(φ) * Math.sin(θ)
  )
}

function spline(lat1, lon1, lat2, lon2) {
  const start = pos(lat1, lon1, window.earth.radius)
  const end = pos(lat2, lon2, window.earth.radius)
  const distance = start.distanceTo(end)
  const minAltitude = window.earth.radius * 0.3
  const maxAltitude = window.earth.radius * 0.5
  const altitude = Math.min(Math.max(distance, minAltitude), maxAltitude)
  const interpolate = window.d3.geoInterpolate([lon1, lat1], [lon2, lat2])
  const midCoord1 = interpolate(0.25)
  const midCoord2 = interpolate(0.75)
  const mid1 = pos(midCoord1[1], midCoord1[0], window.earth.radius + altitude)
  const mid2 = pos(midCoord2[1], midCoord2[0], window.earth.radius + altitude)
  return new THREE.CubicBezierCurve3(start, mid1, mid2, end)
}

function loadTexture(filename) {
  const loader = new THREE.TextureLoader
  return new Promise((resolve, reject) => {
    loader.load(window[filename], resolve, undefined, reject)
  })
}

function initPauseButton() {
  window.pauseButton = document.querySelector("[aria-label='pause']")
  window.paused = false
  window.pauseButton.addEventListener("click", event => {
    if (document.body.dataset.mode == "play") {
      window.pause()
    } else {
      window.unpause()
    }
  })
}

window.pause = function() {
  document.body.dataset.mode = "pause"
  window.controls.enabled = false
  window.paused = true
  cancelAnimationFrame(window.animationRequest)
}

window.unpause = function() {
  document.body.dataset.mode = "play"
  window.controls.enabled = true
  window.paused = false
  window.startAnimation()
}

function initProgressBar() {
  window.progressBar = document.querySelector(
    "[aria-label='progress'] path:nth-child(2)"
  )
}

function updateProgressBar() {
  const progress = window.missileCount / window.missileTotal
  window.progressBar.style.strokeDashoffset = 1024 - Math.floor(
    1024 * progress
  )
}

function initCanvas() {
  window.canvas = document.querySelector("canvas")
  window.touchActive = false

  function touchStart(event) {
    if (window.paused) {
      return
    }
    console.log(event)
    window.touchActive = true
  }

  function touchEnd(event) {
    if (window.paused) {
      return
    }
  }

  canvas.addEventListener("mousedown", touchStart)
  canvas.addEventListener("mouseup", touchEnd)
  canvas.addEventListener("touchstart", touchStart)
  canvas.addEventListener("touchend", touchEnd)
}

;(async function() {
  // console.log("loaded")
  // return
  initRenderer()
  initScenery()
  initScene()
  initCamera()
  initControls()

  await initSpace()

  initSun()
  await initEarth()
  initInnerAtmosphere()
  initOuterAtmosphere()

  initConflict()
  initProgressBar()
  initMissiles()
  // initAxes()

  initPauseButton()
  startAnimation()
  initCanvas()
})()
