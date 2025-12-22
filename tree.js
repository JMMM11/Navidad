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

/* 🎄 PARAMETROS DEL ARBOL */
const params = {
  count: 80000,
  height: 4,
  radius: 2,
  spin: 2.5,
  randomness: 0.5,
  size: 0.02
};

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

  positions[i3]     = Math.cos(angle) * radius + randomX;
  positions[i3 + 1] = y;
  positions[i3 + 2] = Math.sin(angle) * radius + randomZ;

  // Color gradual
  const mix = y / params.height;
  const color = bottomColor.clone().lerp(topColor, mix);

  colors[i3]     = color.r;
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

/* ⭐ ESTRELLA */
const star = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xffd700 })
);
star.position.y = params.height + 0.2;
scene.add(star);

/* 🎞️ ANIMACIÓN */
const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();
  tree.rotation.y = t * 0.15;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
