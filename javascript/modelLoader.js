import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';

// Load Car Model
export const loadCarModel = async () => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('../Models/exo90.glb', (gltf) => {
            const car = gltf.scene;
            const mainCarNode = car.children[0]; // Target the primary child node

            // Set scale, position, and rotation on the primary node
            mainCarNode.scale.set(0.35, 0.35, 0.35);  // Adjust scale as needed
            mainCarNode.position.set(0, 0, 0);  // Place car at origin or desired start position
            mainCarNode.rotation.z = Math.PI / 2;  // Rotate the primary node 90 degrees around Y-axis

            // Ensure all child meshes within the primary node cast and receive shadows
            mainCarNode.traverse((child) => {
                if (child.isMesh) {
                    //child.rotateY(Math.PI/2);
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.side = THREE.DoubleSide;
                        child.material.emissive = new THREE.Color(0x222222); // Adjust emissive color
                        child.material.needsUpdate = true;
                    }
                        if (child.isMesh && child.name.includes('Object_16')) { // Adjust the condition based on your model
        child.material.transparent = true;
        child.material.opacity = 0.5; // Adjust opacity as needed
        child.material.needsUpdate = true;
    }
                    console.log('child.name:', child.name);
                    
                }
            });
            car.rotateY(Math.PI / 2);
            resolve(car);
        }, undefined, (error) => reject(error));
    });
};

// Load Track Model
export const loadTrack = () => {
    const loader = new FBXLoader();
    return new Promise((resolve, reject) => {
        loader.load('../Models/Formula_Track.fbx',
            (fbx) => resolve(fbx),
            (xhr) => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
            (error) => reject(error)
        );
    });
};

// Load House Model
export const loadHouseModel = (path, scale, position) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
            const house = gltf.scene;
            house.scale.set(...scale); // Set scale
            house.position.set(...position); // Set position
            resolve(house);
        }, undefined, (error) => reject(error));
    });
};

// Load Skybox
export const loadSkybox = (scene) => {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '../skybox/px.png', // Right
        '../skybox/nx.png', // Left
        '../skybox/py.png', // Top
        '../skybox/ny.png', // Bottom
        '../skybox/pz.png', // Front
        '../skybox/nz.png', // Back
    ]);
    scene.background = texture;
};

let sharedStreetlightMaterial = null;

// **New Function: Load Streetlight Model with Shared Material**
export const loadStreetlightModel = async () => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('../Models/free_streetlight.glb', (gltf) => {
            const streetlight = gltf.scene;
            streetlight.scale.set(1, 1, 1); // Adjust scale as needed

            // Adjust the model's origin to the base if necessary
            const box = new THREE.Box3().setFromObject(streetlight);
            const center = new THREE.Vector3();
            box.getCenter(center);
            streetlight.position.y -= box.min.y; // Shift the model so that its base is at y=0

            streetlight.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    if (!sharedStreetlightMaterial) {
                        sharedStreetlightMaterial = child.material;
                    } else {
                        child.material = sharedStreetlightMaterial;
                    }
                }
            });
            resolve(streetlight);
        }, undefined, (error) => reject(error));
    });
};