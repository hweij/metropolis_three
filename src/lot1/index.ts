import * as THREE from 'three';
import { HBoxGeometry } from '../geometry/hbox_geometry';
import { createUV, Face, HPlaneGeometry } from '../geometry/hplane_geometry';

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
    const uvs = makeUV(0, 0, 1, 1);
    var geo = new HPlaneGeometry([0,0, 10.8,0, 10.8,15, 0,15], [], [10.8, 15], Face.TOP, {pos: [0,0,0]});
    var plane = new THREE.Mesh(geo, matGroundLevel);
    scene.add(plane);
    // Foundation, floor at elevation
    // const foundation = addBox([7.7, 0.4, 10], [2,0,-2.85], matGroundLevel, scene);
    const fgeo = new HPlaneGeometry([
        3.5,2.85, 9.45,2.85, 9.45,13.15, 1.85,13.15, 1.85, 5.85, 3.5, 5.85], [], [10.8, 15], Face.TOP, {pos: [0,0.4,0], depth: 0.2, uvmat: createUV([0,0,1,1], 3, false)});
    const foundation = new THREE.Mesh(fgeo, matGroundLevel);
    scene.add(foundation);

    // TEST TEST
    // const hextrude = new HPlaneGeometry([0,0, 1,0, 1,1, 0,1],[[0.2, 0.2, 0.8, 0.2, 0.8, 0.8, 0.2, 0.8]], 1, 1, "bottom", [5,4,0]);
    // const hmesh = new THREE.Mesh(hextrude, matGroundLevel);
    // scene.add(hmesh);
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