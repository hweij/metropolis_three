import * as THREE from "three";
import * as earcut from 'earcut';

export class HPlaneGeometry extends THREE.BufferGeometry {
    constructor(shape: number[], holes: number[][], width: number, height: number, face: string, pos = [0,0,0]) {
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
            switch (face) {
                case "front":
                    vertices3d.push(pos[0] + x, pos[1] + y, pos[2]);
                    normals.push(0, 0, 1);
                    break;
                case "back":
                    vertices3d.push(pos[0] + width - x, pos[1] + y, pos[2]);
                    normals.push(0, 0, -1);
                    break;
                case "top":
                    vertices3d.push(pos[0] + x, pos[1], pos[2] - y);
                    normals.push(0, 1, 0);
                    break;
                case "bottom":
                    vertices3d.push(pos[0] + x, pos[1], pos[2] + y - width);
                    normals.push(0, -1, 0);
                    break;
                case "right":
                    vertices3d.push(pos[0], pos[1] + y, pos[2] - x);
                    normals.push(1, 0, 0);
                    break;
                case "left":
                    vertices3d.push(pos[0], pos[1] + y, pos[2] + x - width);
                    normals.push(-1, 0, 0);
                    break;
                }
            uvs.push(x / width, y / height);
        }

        this.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices3d), 3));
        this.addIndex(indices);
        this.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        this.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    }
}
