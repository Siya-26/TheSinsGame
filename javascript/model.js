import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Load and return the track model as a promise
export const loadTrackModel = async() => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            '../Models/desert_race_game_prototype_map_v2.glb',
            (gltf) => {
                const track = gltf.scene;
                track.scale.set(0.05, 0.05, 0.05);  // Adjust scale
                track.position.set(0, 0, 0);  // Center the track

                // Enable shadows and ensure visibility
                track.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.material.transparent = false;
                        child.material.opacity = 1.0;
                    }
                });
                resolve(track);  // Resolve with the loaded track
            },
            (xhr) => console.log(`Progress: ${(xhr.loaded / xhr.total) * 100}%`),
            (error) => reject(error)
        );
    });
};
