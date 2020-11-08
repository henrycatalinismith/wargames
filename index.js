import createAtmosphereMaterial from "./threex.atmospherematerial"
import { geoInterpolate } from "d3-geo"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

document.addEventListener("DOMContentLoaded", async () => {
  function loadTexture(filename) {
    const loader = new THREE.TextureLoader
    return new Promise((resolve, reject) => {
      loader.load(filename, resolve, undefined, reject)
    })
  }

  const earthRadius = 0.5
  const earthSegments = 64

  function pos(lat, lng, radius) {
    const φ = (90 - lat) * Math.PI / 180
    const θ = (lng + 180) * Math.PI / 180
    return new THREE.Vector3(
      - radius * Math.sin(φ) * Math.cos(θ),
      radius * Math.cos(φ),
      radius * Math.sin(φ) * Math.sin(θ)
    )
  }

  function spline({ lat1, lon1, lat2, lon2 }) {
    const start = pos(lat1, lon1, earthRadius)
    const end = pos(lat2, lon2, earthRadius)
    const distance = start.distanceTo(end)
    const minAltitude = earthRadius * 0.2
    const maxAltitude = earthRadius * 0.3
    const altitude = Math.min(Math.max(distance, minAltitude), maxAltitude)
    const interpolate = geoInterpolate([lon1, lat1], [lon2, lat2])
    const midCoord1 = interpolate(0.25)
    const midCoord2 = interpolate(0.75)
    const mid1 = pos(midCoord1[1], midCoord1[0], earthRadius + altitude)
    const mid2 = pos(midCoord2[1], midCoord2[0], earthRadius + altitude)
    return {
      start,
      end,
      spline: new THREE.CubicBezierCurve3(start, mid1, mid2, end),
    }
  }

  const earthGeometry = new THREE.SphereGeometry(
    earthRadius,
    earthSegments,
    earthSegments,
  )

  const day = await loadTexture("day.jpg")
  const night = await loadTexture("night.jpg")
  const skyTexture = await loadTexture("sky.jpg")

  const earthBump = await loadTexture("earth-bump.jpg")
  const earthSpecular = await loadTexture("earth-specular.jpg")
  const earthTexture = await loadTexture("earth-texture.jpg")

  const sunDirection = new THREE.Vector3(1, 0, .5)

  const earthMaterial = new THREE.ShaderMaterial({
    map: earthTexture,
    bumpMap: earthBump,
    bumpScale: 5,
    specular: new THREE.Color(0x333333),
    specularMap: earthSpecular,
    shininess: 50,
    uniforms: {
      sunDirection: {
        value: sunDirection,
      },
      dayTexture: {
        value: day,
      },
      nightTexture: {
        value: night,
      }
    },
    vertexShader: dayNightShader.vertex,
    fragmentShader: dayNightShader.fragment
  })

  const earthMesh = new THREE.Mesh(
    earthGeometry,
    earthMaterial,
  )

  const innerAtmosphereMaterial = createAtmosphereMaterial()
  innerAtmosphereMaterial.uniforms.glowColor.value.set(0x88ffff)
  innerAtmosphereMaterial.uniforms.coeficient.value = 1
  innerAtmosphereMaterial.uniforms.power.value = 5

  const innerAtmosphereMesh = new THREE.Mesh(
    earthGeometry.clone(),
    innerAtmosphereMaterial
  )
  innerAtmosphereMesh.scale.multiplyScalar(1.008)
  earthMesh.add(innerAtmosphereMesh)

  const outerAtmosphereMaterial = createAtmosphereMaterial()
  outerAtmosphereMaterial.side = THREE.BackSide
  outerAtmosphereMaterial.uniforms.glowColor.value.set(0x0088ff)
  outerAtmosphereMaterial.uniforms.coeficient.value = .68
  outerAtmosphereMaterial.uniforms.power.value = 10
  const outerAtmosphereMesh = new THREE.Mesh(
    earthGeometry.clone(),
    outerAtmosphereMaterial
  )
  outerAtmosphereMesh.scale.multiplyScalar(1.06)
  earthMesh.add(outerAtmosphereMesh)

  const skyGeometry = new THREE.SphereGeometry(
    earthRadius * 4,
    earthSegments,
    earthSegments,
  )

  const skyMaterial = new THREE.MeshPhongMaterial({
    side: THREE.BackSide,
    shininess: 0.4,
  })
  skyMaterial.map = skyTexture
  skyMaterial.needsUpdate = true

  const skyMesh = new THREE.Mesh(
    skyGeometry,
    skyMaterial,
  )

  const missilesMaterial = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    opacity: 1,
    // transparent: true,
    color: 0xe43c59,
  })
  const missilesMesh = new THREE.Mesh()

  const missileSpline = spline({
    lat1: 58,
    lon1: 56,
    lat2: 62,
    lon2: -136,
  })

  const missileCurveSegments = 32
  const missileTubeRadiusSegments = 2
  const missileTubeDefaultRadius = 0.005
  const missileDrawRangeDelta = 16
  const missileMaxDrawRange = missileDrawRangeDelta * missileCurveSegments

  const missileGeometery = new THREE.TubeBufferGeometry(
    missileSpline.spline,
    missileCurveSegments,
    missileTubeDefaultRadius,
    missileTubeRadiusSegments,
    false
  )
  missileGeometery.setDrawRange(0, missileMaxDrawRange)

  const missileMesh = new THREE.Mesh(
    missileGeometery,
    missilesMaterial,
  )

  missilesMesh.add(missileMesh)

  const axes = new THREE.AxesHelper(earthRadius * 1.2)

  const scenery = new THREE.Object3D
  scenery.add(axes)
  scenery.add(skyMesh)
  scenery.add(earthMesh)
  scenery.add(missilesMesh)

  const scene = new THREE.Scene
  scene.add(new THREE.AmbientLight(0xffffff))
  scene.add(new THREE.AmbientLight(0xffffff))
  scene.add(scenery)

  const renderer = new THREE.WebGLRenderer
  renderer.setClearColor(0x000000, 1.0)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    100,
  )
  camera.position.x = 0
  camera.position.y = 1
  camera.position.z = 2
  camera.rotation.x = 20

  document.body.appendChild(renderer.domElement)
  renderer.render(scene, camera)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.maxDistance = 3
  controls.minDistance = 1.5

  animate()

  function animate() {
    // scenery.rotation.y -= 0.005
    // sunDirection.x += 0.005
    controls.update()
    renderer.render(scene, camera)

    requestAnimationFrame(animate)
  }
})


const dayNightShader = {
  vertex: `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalMatrix * normal;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragment: `
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
}
