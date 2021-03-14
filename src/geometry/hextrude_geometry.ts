import * as THREE from "three";
import * as earcut from 'earcut';

export class HExtrudeGeometry extends THREE.BufferGeometry {
    constructor(shape: number[], holes: number[][], width: number, height: number) {
        super();

        // Prepare format for earcut
        // Merge shape and hole coordinates into one array
        const vertices = shape.concat(holes.flat(2));
        // Get indices of holes
        const holeIndex = [];
        let offset = shape.length >> 1;
        for (let h of holes) {
            holeIndex.push(offset);
            offset += h.length >> 1;
        }
        const indices = earcut(vertices, holeIndex, 2);
        console.log('RES');
        console.log(indices);

        // Create 3D from flat map
        const vertices3d = [];
        const normals = [];
        const uvs = [];
        const n = vertices.length >> 1;
        for (let i=0; i<n; i++) {
            const x = vertices[i*2];
            const y = vertices[i*2 + 1];
            vertices3d.push(x, y, 0);
            normals.push(0, 0, 1);
            uvs.push(x / width, y / height);
        }

        this.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices3d), 3));
        this.addIndex(indices);
        this.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        this.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    }
}
