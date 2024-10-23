import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { Game } from './javascript/game'; // Assuming Game is the main logic file

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Light blue sky

// Create a shared camera for the game and levels
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10); // Initial camera position

// Initialize the game (pass scene, camera, and renderer)
const game = new Game(scene, camera, renderer);
game.start(); // Start the game logic

// Ensure the renderer updates on window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// Main animation loop
const animate = () => {
  requestAnimationFrame(animate);
  
  // Update the game logic
  game.update(); 

  // Render the scene using the shared camera
  renderer.render(scene, camera);
};

// Start the animation loop
animate();

// Update Renderer and Camera on Resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    // Update camera aspect ratio and projection matrix
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  
    // Resize the renderer to match the new window size
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
  });
  