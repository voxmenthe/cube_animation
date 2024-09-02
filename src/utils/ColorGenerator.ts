import * as THREE from 'three';

export function getRandomColor(): THREE.Color {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
}