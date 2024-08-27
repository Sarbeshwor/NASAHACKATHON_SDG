// Import the necessary THREE.js components
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a scene
const scene = new THREE.Scene();

// Set up a camera with a wide field of view and set its position
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Set up a renderer and attach it to the DOM
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Antialias for smoother edges
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add Ambient Light for even, non-directional lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Soft, white light
scene.add(ambientLight);

// Add a Directional Light for sunlight effect
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Set up controls to allow the user to move the camera around
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth camera movements
controls.dampingFactor = 0.05;

// Load the 3D model
const loader = new GLTFLoader();
loader.load(
  'models/earth/scene.gltf',
  function (gltf) {
    // Add the loaded object to the scene
    const model = gltf.scene;
    scene.add(model);

    // Automatically adjust the camera to fit the model
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    // Position the model on the right side
    model.position.x = 5;

    // Adjust the camera's field of view
    camera.near = size / 100;
    camera.far = size * 100;
    camera.updateProjectionMatrix();

    camera.position.set(center.x + size / 2, center.y, center.z + size * 1.5);
    camera.lookAt(center.x + 5, center.y, center.z); // Focus on the Earth's new position
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error happened:', error);
  }
);

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // only required if controls.enableDamping = true
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
