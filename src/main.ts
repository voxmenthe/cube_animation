import * as THREE from 'three';
import { CameraManager } from './components/Camera';
import { Controls } from './components/Controls';
import { createCharacterTexture } from './utils/TextureGenerator';
import { chineseCharacters, minCameraDistance, maxCameraDistance } from './constants';
import { SceneManager } from './components/Scene';

// Initialize the SceneManager
const sceneManager = new SceneManager();

// The SceneManager handles all the setup, animation, and event listeners,
// so we don't need any additional code here.
