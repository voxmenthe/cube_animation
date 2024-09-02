import * as THREE from 'three';

// Array of Chinese characters to use
const chineseCharacters = ['福', '禄', '寿', '喜', '财', '安', '康', '宁', '德', '智'];

// Function to generate a random color
function getRandomColor(): THREE.Color {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
}

// Function to generate a texture with a Chinese character
function createCharacterTexture(character: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to get 2D context');

  // Set background color
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Set text properties
  context.fillStyle = '#000000';
  context.font = 'bold 200px Arial, SimHei, "Microsoft YaHei", sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Draw the character
  context.fillText(character, canvas.width / 2, canvas.height / 2);

  return new THREE.CanvasTexture(canvas);
}

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create multiple cubes
const cubes: THREE.Mesh[] = [];
const cubeCount = 27; // 3x3x3 grid
const gridSize = 3;
const originalSpacing = 4;
const originalScale = 1;
let currentSpacing = originalSpacing;
let currentScale = originalScale;

let index = 0;
for (let x = 0; x < gridSize; x++) {
  for (let y = 0; y < gridSize; y++) {
    for (let z = 0; z < gridSize; z++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      
      // Create materials for each face with different characters
      const materials = chineseCharacters.slice(0, 6).map(char => {
        const texture = createCharacterTexture(char);
        return new THREE.MeshPhongMaterial({ map: texture });
      });

      const cube = new THREE.Mesh(geometry, materials);
      
      // Position cubes in a grid formation
      cube.position.x = (x - 1) * originalSpacing;
      cube.position.y = (y - 1) * originalSpacing;
      cube.position.z = (z - 1) * originalSpacing;
      
      scene.add(cube);
      cubes.push(cube);

      index++;
      if (index >= cubeCount) break;
    }
    if (index >= cubeCount) break;
  }
  if (index >= cubeCount) break;
}

camera.position.z = 12;

// Scroll wheel control variables
let scrollValue = 0;
let lastScrollTime = Date.now();
const inactivityDelay = 20000; // 2 seconds
const scrollSensitivity = 0.0005; // Reduced sensitivity for finer control

// Wheel event listener
window.addEventListener('wheel', (event) => {
  scrollValue += event.deltaY * scrollSensitivity;
  scrollValue = Math.max(-1, Math.min(1, scrollValue)); // Expanded range from -1 to 1
  lastScrollTime = Date.now();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const currentTime = Date.now();
  const timeSinceLastScroll = currentTime - lastScrollTime;

  if (timeSinceLastScroll < inactivityDelay) {
    // Update cube size and spacing based on scroll value
    currentScale = THREE.MathUtils.lerp(currentScale, originalScale * (1 + scrollValue), 0.1);
    currentSpacing = THREE.MathUtils.lerp(currentSpacing, originalSpacing * (1 + scrollValue * 1.5), 0.1);
  } else {
    // Gradually revert to original size and spacing
    currentScale = THREE.MathUtils.lerp(currentScale, originalScale, 0.05);
    currentSpacing = THREE.MathUtils.lerp(currentSpacing, originalSpacing, 0.05);
    scrollValue = THREE.MathUtils.lerp(scrollValue, 0, 0.05);
  }

  // Update cube positions and scale
  index = 0;
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        const cube = cubes[index];
        cube.position.x = (x - 1) * currentSpacing;
        cube.position.y = (y - 1) * currentSpacing;
        cube.position.z = (z - 1) * currentSpacing;
        cube.scale.setScalar(currentScale);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        index++;
        if (index >= cubeCount) break;
      }
      if (index >= cubeCount) break;
    }
    if (index >= cubeCount) break;
  }

  renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

// Add lighting for better visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
