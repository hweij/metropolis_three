import * as THREE from 'three';

// Camera
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Movement
var keyState = new Set<String>();
var direction = new THREE.Vector3();

export function tick(dt: number) {
    let dy = 0, dz = 0;
    if (keyState.has('SHIFT')) {
        dy = keyState.has('ARROWUP') ? 1 : (keyState.has('ARROWDOWN') ? -1 : 0);
    }
    else {
        dz = keyState.has('ARROWUP') ? 1 : (keyState.has('ARROWDOWN') ? -1 : 0);
    }
    if (dz || dy) {
        const p = camera.position;
        if (dz) {
            camera.getWorldDirection(direction);
            const s = dz * dt * 4;
            p.set((s * direction.x) + p.x, (s * direction.y) + p.y, (s * direction.z) + p.z);
        }
        else {
            p.y = dy * dt * 4 + p.y;
        }
    }
    let rot = keyState.has('ARROWLEFT') ? 1 : (keyState.has('ARROWRIGHT') ? -1 : 0);
    if (rot) {
        camera.rotateY(rot * dt);
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

camera.position.x = 5.4;
camera.position.y = 1.6;
camera.position.z = 5;
