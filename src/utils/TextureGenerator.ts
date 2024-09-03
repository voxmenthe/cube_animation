import * as THREE from 'three';

export function createCharacterTexture(character: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  if (context) {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 256, 256);
    context.fillStyle = '#000000';
    context.font = 'bold 200px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(character, 128, 128);
  }

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  texture.center.set(0.5, 0.5); // Set rotation center to middle of texture
  return texture;
}