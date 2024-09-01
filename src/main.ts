import * as THREE from 'three';

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a more complex geometry for interesting deformations
const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, wireframe: false });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene.add(light);

camera.position.z = 5;

// Mouse position tracking
const mouse = new THREE.Vector2();
const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

// Event listeners
document.addEventListener('mousemove', onMouseMove);
window.addEventListener('resize', onWindowResize);

function onMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX - windowHalf.x) / windowHalf.x;
    mouse.y = (event.clientY - windowHalf.y) / windowHalf.y * -1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    windowHalf.set(window.innerWidth / 2, window.innerHeight / 2);
}

// Store the original geometry for reference
const originalGeometry = geometry.clone();

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate cube based on mouse position
    cube.rotation.x += 0.01 + mouse.y * 0.05;
    cube.rotation.y += 0.01 + mouse.x * 0.05;

    // Change cube color based on mouse position
    const hue = (mouse.x + 1) / 2; // Map mouse.x from [-1, 1] to [0, 1]
    const saturation = (mouse.y + 1) / 2; // Map mouse.y from [-1, 1] to [0, 1]
    material.color.setHSL(hue, saturation, 0.5);

    // Deform cube based on time
    const positions = geometry.attributes.position.array as Float32Array;
    const originalPositions = originalGeometry.attributes.position.array as Float32Array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];
        
        const distance = Math.sqrt(x * x + y * y + z * z);
        const deformationAmount = Math.sin(distance * 5 + time) * 0.1;
        
        const scaleFactor = Math.max(0.5, Math.min(1.5, 1 + deformationAmount));
        
        positions[i] = x * scaleFactor;
        positions[i + 1] = y * scaleFactor;
        positions[i + 2] = z * scaleFactor;
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();
