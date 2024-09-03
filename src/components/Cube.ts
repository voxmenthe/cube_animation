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
    
    const pastelColors = [
      0xffb3ba, 0xffdfba, 0xffffba, 0xbaffc9, 0xbae1ff, 0xe1baff
    ];
    
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        for (let z = 0; z < this.gridSize; z++) {
          const geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
          
          const materials = characters.map((char, index) => {
            const texture = createCharacterTexture(char);
            texture.center.set(0.5, 0.5); // Set rotation center to middle of texture
            return new THREE.MeshPhongMaterial({ 
              map: texture,
              color: pastelColors[index % pastelColors.length],
              transparent: true,
              opacity: 0.8
            });
          });

          const cube = new THREE.Mesh(geometry, materials);
          
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
        cube.rotation.x += 0.01; // Rotate only around x-axis for front-to-back rotation

        // Ensure the cube always faces the camera
        cube.quaternion.setFromEuler(new THREE.Euler(cube.rotation.x, 0, 0));

        // Counter-rotate the textures to keep characters upright
        if (Array.isArray(cube.material)) {
          cube.material.forEach((material) => {
            if (material instanceof THREE.MeshPhongMaterial && material.map) {
              material.map.rotation = -cube.rotation.x;
              material.map.needsUpdate = true;
            }
          });
        }
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