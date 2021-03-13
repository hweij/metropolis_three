import * as THREE from 'three';
import { HBoxGeometry } from '../geometry/hbox_geometry';

const defaultMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const matGroundLevel = createTexMaterial("/images/ground_level.png");

export function addLot(scene: THREE.Scene) {
    addGroundLevel(scene);
}

function makeUV(x0, y0, x1, y1) {
    return new Float32Array([
        x0, y1,
        x1, y1,
        x0, y0,
        x1, y0
    ]);
}

function addGroundLevel(scene: THREE.Scene) {
    // Ground level plane
    // var uvs = new Float32Array([
    //     0, 1,
    //     1, 1,
    //     0, 0,
    //     1, 0
    // ]);
    const uvs = makeUV(0, 0, 1, 1);
    var geo = new THREE.PlaneBufferGeometry(10.8, 15);
    geo.addAttribute('uv', new THREE.BufferAttribute( uvs, 2 ))
    var plane = new THREE.Mesh(geo, matGroundLevel);
    plane.position.set(5.4, 0, -7.5);
    plane.rotateX(- Math.PI / 2);
    scene.add(plane);
    // Foundation, floor at elevation
    const foundation = addBox([7.7, 0.4, 10], [2,0,-2.85], matGroundLevel, scene);
}

function createTexMaterial(url: string) {
    const tex = new THREE.TextureLoader().load(url);
    return new THREE.MeshBasicMaterial({ map: tex });
}

function addBox(size: [number,number,number], pos: [number,number,number], mat: THREE.Material, scene: THREE.Scene) {
    const geo = new HBoxGeometry(size, {pos: pos});
    const box = new THREE.Mesh(geo, mat);
    scene.add(box);
    return box;
}