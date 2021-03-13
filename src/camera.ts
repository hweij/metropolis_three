import * as THREE from 'three';

// Camera
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Movement
var keyState = new Set<String>();
var direction = new THREE.Vector3();

export function tick(dt: number) {
    if (dt) {
        const shift = keyState.has('SHIFT');
        const dMove = keyState.has('ARROWUP') ? 1 : (keyState.has('ARROWDOWN') ? -1 : 0);
        if (dMove) {
            const p = camera.position;
            if (shift) {
                p.y = dMove * dt * 4 + p.y;
            }
            else {
                camera.getWorldDirection(direction);
                const s = dMove * dt * 4;
                p.set((s * direction.x) + p.x, (s * direction.y) + p.y, (s * direction.z) + p.z);
            }
        }
        const rot = keyState.has('ARROWLEFT') ? 1 : (keyState.has('ARROWRIGHT') ? -1 : 0);
        if (rot) {
            camera.rotateY(rot * dt);
        }
    }
}

window.addEventListener('keydown', _doKeyDown);
window.addEventListener('keyup', _doKeyUp);

function _doKeyDown(ev: KeyboardEvent) {
    keyState.add(ev.key.toUpperCase());
}

function _doKeyUp(ev: KeyboardEvent) {
    keyState.delete(ev.key.toUpperCase());
}

const defaultPosition = [5.4, 1.6, 5];

export function setPosition(p: number[]) {
    camera.position.x = p[0];
    camera.position.y = p[1];
    camera.position.z = p[2];
}

setPosition(defaultPosition);
