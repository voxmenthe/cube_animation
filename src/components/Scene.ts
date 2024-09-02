import * as THREE from 'three';
import { CameraManager } from './Camera';
import { CubeManager } from './Cube';
import { Controls } from './Controls';

export class SceneManager {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private cameraManager: CameraManager;
  private cubeManager: CubeManager;
  private controls: Controls;
  private lastScrollTime: number;

  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Change background color to a soft, dark blue
    this.renderer.setClearColor(0x1a2b3c, 1);
    document.body.appendChild(this.renderer.domElement);

    this.cameraManager = new CameraManager(this.renderer);
    this.controls = new Controls(this.updateScene.bind(this));
    this.cubeManager = new CubeManager(this.scene, 216, this.controls);
    this.lastScrollTime = Date.now();

    this.setupLighting();
    this.setupEventListeners();
    this.animate();
  }

  private setupLighting() {
    // Increase ambient light intensity for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Adjust directional light for softer shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);
  }

  private setupEventListeners() {
    window.addEventListener('wheel', this.handleWheel.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleWheel(event: WheelEvent) {
    this.cameraManager.handleZoom(event.deltaY);
    this.lastScrollTime = Date.now();
  }

  private handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.cameraManager.handleResize(width, height);
  }

  private updateScene() {
    const newCubeCount = this.controls.getCubeCount();
    const characterSet = this.controls.getCharacterSet();
    this.cubeManager.updateCubes(newCubeCount, characterSet);
    const cubeSize = this.cubeManager.getCubeSize();
    this.cameraManager.updateCameraPosition(this.cubeManager.getGridSize(), cubeSize);
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.cubeManager.updateCubeRotations();
    this.cameraManager.update();
    this.renderer.render(this.scene, this.cameraManager.camera);
  }
}