
export enum Face {
    FRONT, BACK,
    LEFT, RIGHT,
    TOP, BOTTOM
};

/**
 * Transforms a texture with rotation (in steps of 90deg) and mirror on u-axis.
 *
 * @param bounds u0, v0, u1, v1 bounds for the texture
 * @param rot 0..3 rotation in 90deg steps
 * @param flip flips the texture in u direction
 * @returns Texture transform matrix
 */
export function createTexMatrix(bounds: [number, number, number, number], rot: 0 | 1 | 2 | 3, flip: boolean) {
    const [u0, v0, u1, v1] = bounds;
    const du = u1 - u0;
    const dv = v1 - v0;

    switch (rot) {
        case 0:
            return [
                du, 0, u0,
                0, dv, v0
            ];
        case 1: // 90
            return [
                0, -du, 1 - u0,
                dv, 0, v0
            ];
        case 2: // 180
            return [
                -dv, 0, 1 - v0,
                0, -du, 1 - u0
            ];
        case 3: // 270
            return [
                0, dv, v0,
                -du, 0, 1 - u0
            ];
    }
}

/**
 * Creates a matrix for transforming to a specified face.
 *
 * @param face Face direction of the plane (6 possibilities)
 * @param w Face width
 * @param h Face height
 * @param pos Position (translation)
 * @returns Matrix for transforming to the specified face
 */
export function createFaceMatrix(face: Face, w: number, h: number, pos: number[]) {
    let mat;
    switch (face) {
        case Face.FRONT:
            mat = [
                1, 0, 0, pos[0],
                0, 1, 0, pos[1],
                0, 0, 1, pos[2]
            ];
            break;
        case Face.BACK:
            // Back: flip front, move w to the right
            mat = [
                -1, 0, 0, pos[0] + w,
                0, 1, 0, pos[1],
                0, 0, 1, pos[2]
            ];
            break;
        case Face.BOTTOM:
            // Bottom: swap y and z
            mat = [
                1, 0, 0, pos[0],
                0, 0, 0, pos[1],
                0, 1, 1, pos[2]
            ];
            break;
        case Face.TOP:
            // Top: swap y and z, flip around x-axis, translate over z
            mat = [
                1, 0, 0, pos[0],
                0, 0, 0, pos[1],
                0, -1, 1, pos[2] + h
            ];
            break;
        case Face.LEFT:
            // Left: rotate around y
            mat = [
                0, 0, 0, pos[0],
                0, 1, 0, pos[1],
                1, 0, 1, pos[2]
            ];
            break;
        case Face.RIGHT:
            // Left: rotate around y, translate over z
            mat = [
                0, 0, 0, pos[0],
                0, 1, 0, pos[1],
                -1, 0, 1, pos[2] + w
            ];
            break;
    }
    return mat;
}

/**
 * Multiply a 4 x 3 matrix with a 3D vector.
 *
 * @param mat
 * @param x
 * @param y
 * @param z
 * @returns
 */
export function mul3(mat: number[], x: number, y: number, z: number) {
    return [
        (mat[0] * x) + (mat[1] * y) + (mat[2] * z) + mat[3],
        (mat[4] * x) + (mat[5] * y) + (mat[6] * z) + mat[7],
        (mat[8] * x) + (mat[9] * y) + (mat[10] * z) + mat[11]
    ];
}

export function mul2(mat: number[], x: number, y: number) {
    return [
        (mat[0] * x) + (mat[1] * y) + mat[2],
        (mat[3] * x) + (mat[4] * y) + mat[5]
    ];
}
