import * as THREE from "three";

/**
 * A set of four texture coordinates ([0,0],[1,0],[0,1],[1,1]) for each
 * vertex of the face or a set of two corner coordinates ([0,0] => [1,1])
 */
type UV = [[number,number], [number,number], [number,number], [number,number]] | [[number,number], [number,number]];

type GeoParam = {
    pos?: [number,number,number];
    uvFront?: UV;
    uvBack?: UV;
    uvLeft?: UV;
    uvRight?: UV;
    uvTop?: UV;
    uvBottom?: UV;
}

export const UV_FLIP_H = [[1,0],[0,0],[1,1],[0,1]] as UV;

function _normUV(uv: UV) {
    if (!uv) {
        return [[0,0],[1,0],[0,1],[1,1]];   // Default UV
    }
    else {
        if (uv.length == 2) {
            const [x0,y0] = uv[0];
            const [x1,y1] = uv[1];
            return [[x0,y0],[x1,y0],[x0,y1],[x1,y1]];
        }
        else {
            return uv;
        }
    }
}

export class HBoxGeometry extends THREE.BufferGeometry {
    constructor(size: [number, number, number], p: GeoParam = {}) {
        super();

        if (!p.pos) {
            p.pos = [0,0,0];
        }
        const [x0, y0, z1] = p.pos;
        const [dx, dy, dz] = size;
        const [x1, y1, z0] = [x0 + dx, y0 + dy, z1 - dz];
        const uvFront = _normUV(p.uvFront);
        const uvBack = _normUV(p.uvBack);
        const uvLeft = _normUV(p.uvLeft);
        const uvRight = _normUV(p.uvRight);
        const uvTop = _normUV(p.uvTop);
        const uvBottom = _normUV(p.uvBottom);

        const nFront = [0, 0, 1];
        const nBack = [0, 0, -1];
        const nRight = [1, 0, 0];
        const nLeft = [-1, 0, 0];
        const nTop = [0, 1, 0];
        const nBottom = [0, -1, 0];

        const verts = [
            [x0,y0,z0],
            [x0,y0,z1],
            [x0,y1,z0],
            [x0,y1,z1],
            [x1,y0,z0],
            [x1,y0,z1],
            [x1,y1,z0],
            [x1,y1,z1]
        ];

        const positions = [];
        const normals = [];
        const uvs = [];

        addFace([1,5,3,3,5,7], nFront, uvFront);
        addFace([5,4,7,7,4,6], nRight, uvRight);
        addFace([4,0,6,6,0,2], nBack, uvBack);
        addFace([0,1,2,2,1,3], nLeft, uvLeft);
        addFace([3,7,2,2,7,6], nTop, uvTop);
        addFace([0,4,1,1,4,5], nBottom, uvBottom);

        function addFace(idx: number[], nv: number[], uv: number[][]) {
            for (let i=0; i<6; i++) {
                positions.push(...verts[idx[i]]);
            }
            normals.push(...nv,...nv,...nv,...nv,...nv,...nv);
            uvs.push(...uv[0],...uv[1],...uv[2],...uv[2],...uv[1],...uv[3]);
        }

        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;

        this.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        this.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        this.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
    }
}
