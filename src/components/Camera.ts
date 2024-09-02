import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class CameraManager {
  camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbitControls: OrbitControls;
  private targetDistance: number;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.targetDistance = 10; // Default distance
    this.updateCameraPosition(6, 1); // Default values
  }

  updateCameraPosition(gridSize: number, cubeSize: number) {
    const maxDimension = Math.ceil(Math.cbrt(gridSize * gridSize * gridSize));
    this.targetDistance = (maxDimension * cubeSize * 1.2) / Math.tan((this.camera.fov * Math.PI) / 360);
    this.camera.position.set(this.targetDistance, this.targetDistance, this.targetDistance);
    this.camera.lookAt(0, 0, 0);
    this.orbitControls.target.set(0, 0, 0);
    this.orbitControls.update();
  }

  handleZoom(deltaY: number) {
    const zoomSpeed = 0.001;
    const zoomDelta = deltaY * zoomSpeed * this.targetDistance;
    this.orbitControls.dollyIn(1 + zoomDelta);
    this.orbitControls.update();
  }

  update() {
    this.orbitControls.update();
  }

  handleResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.orbitControls.update();
  }
}