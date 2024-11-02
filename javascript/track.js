// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

// export class Track {
//     constructor(scene) {
//         this.scene = scene;
//         this.model = this.createTrackModel();
//         this.scene.add(this.model);
//     }

//     createTrackModel() {
//         const geometry = new THREE.PlaneGeometry(10, 50); // Width, Height
//         const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }); // Green color
//         const track = new THREE.Mesh(geometry, material);
//         track.rotation.x = -Math.PI / 2; // Rotate to be horizontal
//         track.position.set(0, 0, 0); // Position at origin
//         return track;
//     }
// }
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { FuelCan } from '../Models/level2/src/fuelcan'; // Adjust this path as needed

export class Track {
    constructor(scene) {
        this.scene = scene;
        this.model = this.createTrackModel();
        this.scene.add(this.model);
        
        this.fuelCans = []; // Array to store fuel cans
        this.addFuelCans(); // Initialize fuel cans on the track
    }

    createTrackModel() {
        const geometry = new THREE.PlaneGeometry(10, 50); // Width, Height
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }); // Green color
        const track = new THREE.Mesh(geometry, material);
        track.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        track.position.set(0, 0, 0); // Position at origin
        return track;
    }

    addFuelCans() {
        for (let i = 0; i < 5; i++) { // Adjust number of fuel cans as needed
            const fuelCan = FuelCan();
            fuelCan.position.set(
                (Math.random() - 0.5) * 10, // Random x position within track width
                1, // Position it slightly above the track
                (Math.random() - 0.5) * 50 // Random z position within track length
            );
            this.scene.add(fuelCan);
            this.fuelCans.push(fuelCan);
        }
    }
}
