document.addEventListener("DOMContentLoaded", async () => {

  function loadTexture(filename) {
    const loader = new THREE.TextureLoader
    return new Promise((resolve, reject) => {
      loader.load(filename, resolve, undefined, reject)
    })
  }

  const earthRadius = 0.5
  const earthSegments = 64

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

  const innerAtmosphereMaterial = THREEx.createAtmosphereMaterial()
  innerAtmosphereMaterial.uniforms.glowColor.value.set(0x88ffff)
  innerAtmosphereMaterial.uniforms.coeficient.value = 1
  innerAtmosphereMaterial.uniforms.power.value = 5

  const innerAtmosphereMesh = new THREE.Mesh(
    earthGeometry.clone(),
    innerAtmosphereMaterial
  )
  innerAtmosphereMesh.scale.multiplyScalar(1.008)
  earthMesh.add(innerAtmosphereMesh)

  const outerAtmosphereMaterial = THREEx.createAtmosphereMaterial()
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

  const axes = new THREE.AxesHelper(earthRadius * 1.2)

  const scenery = new THREE.Object3D
  scenery.add(axes)
  scenery.add(skyMesh)
  scenery.add(earthMesh)

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

  const controls = new THREE.OrbitControls(camera, renderer.domElement)
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
