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

document.addEventListener("DOMContentLoaded", async () => {

  function loadTexture(filename) {
    const loader = new THREE.TextureLoader()
    return new Promise((resolve, reject) => {
      loader.load(filename, resolve, undefined, reject)
    })
  }

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000, 1.0)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)


  const scene = new THREE.Scene

  const scenery = new THREE.Object3D
  scene.add(scenery)

  const axes = new THREE.AxesHelper(500)
  scenery.add(axes)

  scene.add(new THREE.AmbientLight(0xffffff))
  scene.add(new THREE.AmbientLight(0xffffff))

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100)
  camera.position.x = 0
  camera.position.y = 1
  camera.position.z = 2
  camera.rotation.x = 20

  const sun = new THREE.DirectionalLight(0xffffff, 0.2)
  sun.position.set(5, 3, 5)
  // scene.add(sun)

  const radius = 0.5
  const segments = 64

  const earthGeometry = new THREE.SphereGeometry(radius, segments, segments)

  document.body.appendChild(renderer.domElement)
  renderer.render(scene, camera)

  const day = await loadTexture("day.jpg")
  const night = await loadTexture("night.jpg")
  const skyTexture = await loadTexture("sky.jpg")

  const earthBump = await loadTexture("earth-bump.jpg")
  const earthSpecular = await loadTexture("earth-specular.jpg")
  const earthTexture = await loadTexture("earth-texture.jpg")

  const earthMaterial = new THREE.ShaderMaterial({
    map: earthTexture,
    bumpMap: earthBump,
    bumpScale: 5,
    specular: new THREE.Color(0x333333),
    specularMap: earthSpecular,
    shininess: 50,
    uniforms: {
      sunDirection: {
        value: new THREE.Vector3(1, 0, .5)
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
  });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);

  const innerAtmosphereGeometry = earthGeometry.clone();
  const innerAtmosphereMaterial = THREEx.createAtmosphereMaterial();
  innerAtmosphereMaterial.uniforms.glowColor.value.set(0x88ffff);
  innerAtmosphereMaterial.uniforms.coeficient.value = 1;
  innerAtmosphereMaterial.uniforms.power.value = 5;
  const innerAtmosphere = new THREE.Mesh(innerAtmosphereGeometry, innerAtmosphereMaterial);
  innerAtmosphere.scale.multiplyScalar(1.008);
  earth.add(innerAtmosphere)

  const outerAtmosphereGeometry = earthGeometry.clone();
  const outerAtmosphereMaterial = THREEx.createAtmosphereMaterial();
  outerAtmosphereMaterial.side = THREE.BackSide;
  outerAtmosphereMaterial.uniforms.glowColor.value.set(0x0088ff);
  outerAtmosphereMaterial.uniforms.coeficient.value = .68;
  outerAtmosphereMaterial.uniforms.power.value = 10;
  const outerAtmosphere = new THREE.Mesh(outerAtmosphereGeometry, outerAtmosphereMaterial);
  outerAtmosphere.scale.multiplyScalar(1.06);
  earth.add(outerAtmosphere)

  const skyGeometry = new THREE.SphereGeometry(2, 50, 50);
  const skyMaterial = new THREE.MeshPhongMaterial({
    side: THREE.BackSide,
    shininess: 0.4,
  });
  skyMaterial.map = skyTexture
  skyMaterial.needsUpdate = true
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);

  scenery.add(sky)

  scenery.add(earth)

  const controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.maxDistance = 3
  controls.minDistance = 1.5
  // controls.rotateSpeed = 0.1
  // controls.noZoom = true
  // controls.noPan = true
  // controls.staticMoving = false
  // controls.minDistance = 0.75
  // controls.maxDistance = 3.0

  animate()

  function animate() {
    scenery.rotation.y -= 0.005
    controls.update();
    renderer.render(scene, camera)

    requestAnimationFrame(animate)
  }
})

