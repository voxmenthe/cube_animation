import * as THREE from 'three';
import { createCharacterTexture } from '../utils/TextureGenerator';
import { characterOptions } from '../constants';
import { Controls } from './Controls';

export class CubeManager {
  private cubes: THREE.Mesh[] = [];
  private scene: THREE.Scene;
  private gridSize: number;
  private visibleCubeCount: number;
  private controls: Controls;
  private cubeSize: number;

  constructor(scene: THREE.Scene, initialCubeCount: number, controls: Controls) {
    this.scene = scene;
    this.controls = controls;
    this.gridSize = 6; // Fixed grid size of 6x6x6
    this.visibleCubeCount = initialCubeCount;
    this.cubeSize = this.calculateCubeSize();
    this.createCubes(this.controls.getCharacterSet());
  }

  private calculateCubeSize(): number {
    const maxDimension = Math.ceil(Math.cbrt(this.visibleCubeCount));
    return 10 / maxDimension; // Adjust this value to change overall scale
  }

  createCubes(characterSet: 'simplified' | 'traditional') {
    // Remove existing cubes from the scene
    this.cubes.forEach(cube => this.scene.remove(cube));
    this.cubes = [];

    this.cubeSize = this.calculateCubeSize();
    const dynamicSpacing = this.cubeSize * 1.2; // Adjust spacing as needed
    const characters = this.controls.getSelectedCharacters(characterSet);
    
    // Define an array of pastel colors for cube faces
    const pastelColors = [
      0xffb3ba, // Light pink
      0xffdfba, // Light peach
      0xffffba, // Light yellow
      0xbaffc9, // Light mint
      0xbae1ff, // Light blue
      0xe1baff  // Light purple
    ];
    
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        for (let z = 0; z < this.gridSize; z++) {
          const geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
          
          // Create materials for each face with different characters and colors
          const materials = characters.map((char, index) => {
            const texture = createCharacterTexture(char);
            return new THREE.MeshPhongMaterial({ 
              map: texture,
              color: pastelColors[index % pastelColors.length],
              transparent: true,
              opacity: 0.8 // Add some transparency
            });
          });

          const cube = new THREE.Mesh(geometry, materials);
          
          // Position cubes in a grid formation with dynamic spacing
          cube.position.x = (x - (this.gridSize - 1) / 2) * dynamicSpacing;
          cube.position.y = (y - (this.gridSize - 1) / 2) * dynamicSpacing;
          cube.position.z = (z - (this.gridSize - 1) / 2) * dynamicSpacing;
          
          this.scene.add(cube);
          this.cubes.push(cube);
        }
      }
    }

    this.updateVisibleCubes();
  }

  updateCubes(newCount: number, characterSet: 'simplified' | 'traditional') {
    this.visibleCubeCount = Math.min(newCount, this.gridSize * this.gridSize * this.gridSize);
    this.createCubes(characterSet);
  }

  private updateVisibleCubes() {
    this.cubes.forEach((cube, index) => {
      cube.visible = index < this.visibleCubeCount;
    });
  }

  updateCubeRotations() {
    this.cubes.forEach((cube) => {
      if (cube.visible) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      }
    });
  }

  getGridSize() {
    return this.gridSize;
  }

  getCubeSize(): number {
    return this.cubeSize;
  }
}