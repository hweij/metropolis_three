import './style.css';
import * as THREE from 'three';
import * as camera from './camera';
import { addLot } from './lot1';

// Scene
const scene = new THREE.Scene();


// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Canvas
document.body.appendChild(renderer.domElement);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(100, 100, 100);
scene.add(light);
const light2 = new THREE.DirectionalLight(0xffffff, 1.0);
light2.position.set(-100, 100, -100);
scene.add(light2);

const material = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  wireframe: true,
});

// create a box and add it to the scene
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
scene.add(box);
box.position.x = 0.5;
box.rotation.y = 0.5;

addLot(scene);

function animate(): void {
  requestAnimationFrame(animate);
  render();
}

var tLast = 0;
function render(): void {
  const t = Date.now() * 0.001; // (secs)
  box.position.y = 0.5 + 0.5 * Math.sin(t);
  box.rotation.x += 0.1;
  camera.tick(t - tLast);
  renderer.render(scene, camera.camera);
  tLast = t;
}



animate();
