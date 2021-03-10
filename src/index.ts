import './style.css';
import * as THREE from 'three';
import * as camera from './camera';

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

// TEST TEST
var geo = new THREE.PlaneBufferGeometry(10.8, 15);
var mat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
var plane = new THREE.Mesh(geo, mat);
plane.position.set(5.4, 0, -7.5);
plane.rotateX( - Math.PI / 2);
scene.add(plane);

// camera.lookAt(scene.position);

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
