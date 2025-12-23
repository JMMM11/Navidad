import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050b15);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2.5, 6);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* 🎄 PARÁMETROS DEL ÁRBOL */
const params = {
  count: 80000,
  height: 4,
  radius: 2,
  spin: 2.5,
  randomness: 0.5,
  size: 0.02
};

/* Crear geometría del árbol */
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(params.count * 3);
const colors = new Float32Array(params.count * 3);

const bottomColor = new THREE.Color("#0b3d1c");
const topColor = new THREE.Color("#7CFF4D");

for (let i = 0; i < params.count; i++) {
  const i3 = i * 3;

  // Altura (punta arriba)
  const y = Math.random() * params.height;

  // Cono real
  const radius = (1 - y / params.height) * params.radius;

  const angle = Math.random() * Math.PI * 2 + y * params.spin;

  const randomX = (Math.random() - 0.5) * params.randomness;
  const randomZ = (Math.random() - 0.5) * params.randomness;

  positions[i3] = Math.cos(angle) * radius + randomX;
  positions[i3 + 1] = y;
  positions[i3 + 2] = Math.sin(angle) * radius + randomZ;

  // Color gradual
  const mix = y / params.height;
  const color = bottomColor.clone().lerp(topColor, mix);

  colors[i3] = color.r;
  colors[i3 + 1] = color.g;
  colors[i3 + 2] = color.b;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: params.size,
  vertexColors: true,
  transparent: true,
  opacity: 0.95,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const tree = new THREE.Points(geometry, material);
scene.add(tree);

/* ================================
   ESTRELLA CLÁSICA (5 PUNTAS)
================================ */

const starGroup = new THREE.Group();

/* Geometría personalizada de estrella */
function createStarShape(outerRadius = 0.22, innerRadius = 0.1) {
  const shape = new THREE.Shape();
  const points = 5;

  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;

    const x = Math.cos(angle - Math.PI / 2) * radius;
    const y = Math.sin(angle - Math.PI / 2) * radius;

    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  shape.closePath();
  return shape;
}

/* Núcleo de la estrella */
const starGeometry = new THREE.ExtrudeGeometry(
  createStarShape(),
  {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2
  }
);

const starMaterial = new THREE.MeshStandardMaterial({
  color: 0xfff1a8,
  emissive: 0xffd700,
  emissiveIntensity: 3,
  roughness: 0.25,
  metalness: 0.4
});

const starMesh = new THREE.Mesh(starGeometry, starMaterial);
starMesh.rotation.x = Math.PI / 10;
starGroup.add(starMesh);

/* Halo de brillo */
const glow = new THREE.Mesh(
  new THREE.SphereGeometry(0.35, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending
  })
);
starGroup.add(glow);

/* Posición */
starGroup.position.y = params.height + 0.25;
scene.add(starGroup);

/* ================================
   ANIMACIÓN
================================ */

const clock = new THREE.Clock();
const starClock = new THREE.Clock();

function animate() {
  const t = clock.getElapsedTime();
  const starTime = starClock.getElapsedTime();

  /* Rotar el árbol */
  tree.rotation.y = t * 0.15;

  /* Animar estrella */
  const pulse = 1 + Math.sin(starTime * 2) * 0.06;
  const glowPulse = 1 + Math.sin(starTime * 1.4) * 0.18;

  starGroup.scale.setScalar(pulse);
  glow.scale.setScalar(glowPulse);
  starGroup.rotation.y += 0.006;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();


/* Ajuste de pantalla */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
