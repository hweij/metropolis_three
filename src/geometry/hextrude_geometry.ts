import * as THREE from "three";

export class HBoxGeometry extends THREE.BufferGeometry {
    constructor(size: [number, number], shape: number[], holes: number[][]) {
        super();

        THREE.ShapeUtils.triangulateShape(shape, holes);
    }
}
