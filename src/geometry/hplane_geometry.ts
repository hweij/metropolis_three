import * as THREE from "three";
import * as earcut from 'earcut';
import * as geomat from "./geomat";

type GeoOptions = {
    pos?: [number, number, number];
    depth?: number;
    uvmat?: number[];
}

export class HPlaneGeometry extends THREE.BufferGeometry {
    constructor(shape: number[], holes: number[][], size: [number, number], face: geomat.Face, options?: GeoOptions) {
        super();

        const [width, height] = size;
        const pos = options?.pos || [0, 0, 0];
        const depth = options?.depth || -1;
        const uvmat = options?.uvmat || [1,0,0,0,1,0];

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

        // Create 3D from flat map
        const vertices3d = [];
        const normals = [];
        const uvs = [];
        const n = vertices.length >> 1;

        const mat = geomat.createFaceMatrix(face, width, height, pos);
        const nv = geomat.mul3(mat, 0, 0, 1);
        for (let i = 0; i < n; i++) {
            const x = vertices[i * 2];
            const y = vertices[i * 2 + 1];
            vertices3d.push(...geomat.mul3(mat, x, y, 0));
            normals.push(...nv);
            const u = x / width;
            const v = y / height;
            uvs.push(...geomat.mul2(uvmat, u, v));
        }
        if (depth >= 0) {
            const nvi = [-nv[0], -nv[1], -nv[2]];
            const vDepth = [nvi[0] * depth, nvi[1] * depth, nvi[2] * depth];
            let index = 0;
            for (let i = 0; i < n; i++) {
                vertices3d.push(
                    vertices3d[index] + vDepth[0],
                    vertices3d[index + 1] + vDepth[1],
                    vertices3d[index + 2] + vDepth[2]
                );
                normals.push(nvi[0], nvi[1], nvi[1]);
                index += 3;
            }
            const uvlen = uvs.length;
            for (let uvi = 0; uvi < uvlen; uvi++) {
                uvs.push(uvs[uvi]);
            }
            console.log(uvs)
            // Add indices for second plane. This is done in reverse order
            // to get the correct facing.
            const ni = indices.length;
            for (let i = 0; i < ni; i++) {
                indices.push(indices[ni - i - 1] + n);
            }
        }

        this.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices3d), 3));
        this.addIndex(indices);
        this.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        this.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    }
}
