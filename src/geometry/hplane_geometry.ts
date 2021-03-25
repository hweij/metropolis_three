import * as THREE from "three";
import * as earcut from 'earcut';

export enum Face {
    FRONT, BACK, LEFT, RIGHT, TOP, BOTTOM
}

export class HPlaneGeometry extends THREE.BufferGeometry {
    constructor(shape: number[], holes: number[][], width: number, height: number, face: Face, pos = [0, 0, 0], depth = -1) {
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

        // Create 3D from flat map
        const vertices3d = [];
        const normals = [];
        const uvs = [];
        const n = vertices.length >> 1;

        const mat = faceMatrix(face, width, height, pos);
        const nv = faceNorm(face);
        for (let i = 0; i < n; i++) {
            const x = vertices[i * 2];
            const y = vertices[i * 2 + 1];
            vertices3d.push(
                (mat[0] * x)+  mat[1],
                (mat[2] * y) + mat[3],
                (mat[4] * x) + (mat[5] * y) + mat[6]
            );
            normals.push(nv[0],nv[1],nv[1]);
            uvs.push(x / width, y / height);
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
                normals.push(nvi[0],nvi[1],nvi[1]);
                index += 3;
            }
            const uvlen = uvs.length;
            for (let uvi = 0; uvi<uvlen; uvi++) {
                uvs.push(uvs[uvi]);
            }
            console.log(uvs)
            // Add indices for second plane. This is done in reverse order
            // to get the correct facing.
            const ni = indices.length;
            for (let i=0; i<ni; i++) {
                indices.push(indices[ni - i - 1] + n);
            }
        }

        this.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices3d), 3));
        this.addIndex(indices);
        this.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        this.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    }
}

function faceNorm(face: Face) {
    switch (face) {
        case Face.FRONT:
            return [0, 0, 1];
        case Face.BACK:
            return [0, 0, -1];
        case Face.LEFT:
            return [-1, 0, 0];
        case Face.RIGHT:
            return [1, 0, 0];
        case Face.TOP:
            return [0, 1, 0];
        case Face.BOTTOM:
            return [0, -1, 0];
    }
}

function faceMatrix(face: Face, w: number, h: number, pos: number[]) {
    let mat;
    switch (face) {
        case Face.FRONT:
            // Front: identity
            mat = [
                1, pos[0],
                1, pos[1],
                0, 0, pos[2]
            ];
            break;
        case Face.BACK:
            // Back: flip front, move w to the right
            mat = [
                -1, pos[0] + w,
                1, pos[1],
                0, 0, pos[2]
            ];
            break;
        case Face.BOTTOM:
            // Bottom: swap y and z
            mat = [
                1, pos[0],
                0, pos[1],
                0, 1, pos[2]
            ];
            break;
        case Face.TOP:
            // Top: swap y and z, flip around x-axis, translate over z
            mat = [
                1, pos[0],
                0, pos[1],
                0, -1, pos[2] + h
            ];
            break;
        case Face.LEFT:
            // Left: rotate around y
            mat = [
                0, pos[0],
                1, pos[1],
                1, 0, pos[2]
            ];
            break;
        case Face.RIGHT:
            // Left: rotate around y, translate over z
            mat = [
                0, pos[0],
                1, pos[1],
                -1, 0, pos[2] + w
            ];
            break;
        }
    return mat;
}