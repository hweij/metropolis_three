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

        const vertices = [
            // front
            { pos: [x0, y0, z1], norm: [0, 0, 1], uv: uvFront[0], },
            { pos: [x1, y0, z1], norm: [0, 0, 1], uv: uvFront[1], },
            { pos: [x0, y1, z1], norm: [0, 0, 1], uv: uvFront[2], },

            { pos: [x0, y1, z1], norm: [0, 0, 1], uv: uvFront[2], },
            { pos: [x1, y0, z1], norm: [0, 0, 1], uv: uvFront[1], },
            { pos: [x1, y1, z1], norm: [0, 0, 1], uv: uvFront[3], },
            // right
            { pos: [x1, y0, z1], norm: [1, 0, 0], uv: uvRight[0], },
            { pos: [x1, y0, z0], norm: [1, 0, 0], uv: uvRight[1], },
            { pos: [x1, y1, z1], norm: [1, 0, 0], uv: uvRight[2], },

            { pos: [x1, y1, z1], norm: [1, 0, 0], uv: uvRight[2], },
            { pos: [x1, y0, z0], norm: [1, 0, 0], uv: uvRight[1], },
            { pos: [x1, y1, z0], norm: [1, 0, 0], uv: uvRight[3], },
            // back
            { pos: [x1, y0, z0], norm: [0, 0, -1], uv: uvBack[0], },
            { pos: [x0, y0, z0], norm: [0, 0, -1], uv: uvBack[1], },
            { pos: [x1, y1, z0], norm: [0, 0, -1], uv: uvBack[2], },

            { pos: [x1, y1, z0], norm: [0, 0, -1], uv: uvBack[2], },
            { pos: [x0, y0, z0], norm: [0, 0, -1], uv: uvBack[1], },
            { pos: [x0, y1, z0], norm: [0, 0, -1], uv: uvBack[3], },
            // left
            { pos: [x0, y0, z0], norm: [-1, 0, 0], uv: uvLeft[0], },
            { pos: [x0, y0, z1], norm: [-1, 0, 0], uv: uvLeft[1], },
            { pos: [x0, y1, z0], norm: [-1, 0, 0], uv: uvLeft[2], },

            { pos: [x0, y1, z0], norm: [-1, 0, 0], uv: uvLeft[2], },
            { pos: [x0, y0, z1], norm: [-1, 0, 0], uv: uvLeft[1], },
            { pos: [x0, y1, z1], norm: [-1, 0, 0], uv: uvLeft[3], },
            // top
            { pos: [x1, y1, z0], norm: [0, 1, 0], uv: uvTop[3], },
            { pos: [x0, y1, z0], norm: [0, 1, 0], uv: uvTop[2], },
            { pos: [x1, y1, z1], norm: [0, 1, 0], uv: uvTop[1], },

            { pos: [x1, y1, z1], norm: [0, 1, 0], uv: uvTop[1], },
            { pos: [x0, y1, z0], norm: [0, 1, 0], uv: uvTop[2], },
            { pos: [x0, y1, z1], norm: [0, 1, 0], uv: uvTop[0], },
            // bottom
            { pos: [x1, y0, z1], norm: [0, -1, 0], uv: uvBottom[3], },
            { pos: [x0, y0, z1], norm: [0, -1, 0], uv: uvBottom[2], },
            { pos: [x1, y0, z0], norm: [0, -1, 0], uv: uvBottom[1], },

            { pos: [x1, y0, z0], norm: [0, -1, 0], uv: uvBottom[1], },
            { pos: [x0, y0, z1], norm: [0, -1, 0], uv: uvBottom[2], },
            { pos: [x0, y0, z0], norm: [0, -1, 0], uv: uvBottom[0], },
        ];

        const positions = [];
        const normals = [];
        const uvs = [];
        for (const vertex of vertices) {
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
            uvs.push(...vertex.uv);
        }

        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;

        this.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        this.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        this.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
    }
}
