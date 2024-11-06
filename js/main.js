const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let cubeMesh = new THREE.Mesh();
let stars, starGeo;
let colorChangeInterval = 3000; // 3 seconds
let lastColorChange = Date.now();

lighting();
cube();
particles();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  stars.geometry.attributes.position.array.forEach((_, i) => {
    if (i % 3 === 1) {
      stars.geometry.attributes.position.array[i] -= 0.9;
      if (stars.geometry.attributes.position.array[i] < -300) {
        stars.geometry.attributes.position.array[i] = 300;
      }
    }
  });
  stars.geometry.attributes.position.needsUpdate = true;

  if (Date.now() - lastColorChange >= colorChangeInterval) {
    stars.material.color.setHex(Math.random() * 0xffffff);
    lastColorChange = Date.now();
  }
}

  const loader = new THREE.FontLoader();
  loader.load('path/to/font.json', function (font) {
      const textGeometry = new THREE.TextGeometry('YourFirstName', {
          font: font,
          size: 5,
          height: 1,
          curveSegments: 12,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });  // Wooden color
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      scene.add(textMesh);
  });
  

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  cubeMesh.rotation.x += 0.008;
  cubeMesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}

animate();
