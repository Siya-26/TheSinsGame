// camera.js
import * as THREE from 'three';

const thirdPersonOffset = new THREE.Vector3(-3, 2, 0); // Third-person view (chase view)
const firstPersonOffset = new THREE.Vector3(1, 0.5, 0); // First-person view (inside car)
const smoothFactor = 0.8; // Factor for smooth camera follow
const fixedCameraY = 2; // Fixed height for the camera
let isFirstPerson = false; // Start with third person by default

// Function to initialize the camera
export const initializeCamera = (thirdPersonView) => {
    const camera = new THREE.PerspectiveCamera(
        thirdPersonView.fieldOfView,
        thirdPersonView.aspect,
        thirdPersonView.nearPlane,
        thirdPersonView.farPlane
    );
    camera.position.set(0, 10, 0);
    return camera;
};

// Smooth camera follow function, updated to support both views
export const smoothCameraFollow = (camera, car) => {
    if (isFirstPerson) {
        // First-person view: Position camera inside the car
        const targetPosition = car.position.clone().add(firstPersonOffset.clone().applyQuaternion(car.quaternion));
        camera.position.lerp(targetPosition, smoothFactor);
        
    } else {
        // Third-person view: Chase view logic
        const carDirection = new THREE.Vector3();
        car.getWorldDirection(carDirection); // Get the car's forward direction
        const carRight = new THREE.Vector3().crossVectors(carDirection, new THREE.Vector3(0, 1, 0)).normalize(); // Get the right direction of the car
        
        const targetPosition = car.position
            .clone()
            .add(carRight.clone().multiplyScalar(thirdPersonOffset.x)) // Move to the side
            .setY(fixedCameraY); // Set a fixed height for the camera

        camera.position.lerp(targetPosition, smoothFactor);
    }

    // Always make the camera look at the car
    camera.lookAt(car.position);
};

// Toggle camera view between first-person and third-person
export const toggleCameraView = () => {
    isFirstPerson = !isFirstPerson;

    if (isFirstPerson) {
        pointerControls.lock(); // Enable pointer lock in first-person view
        controls.enabled = false; // Disable OrbitControls
    } else {
        pointerControls.unlock(); // Disable pointer lock in third-person view
        controls.enabled = true; // Enable OrbitControls
    }
};

// Export `isFirstPerson` state in case other modules need to check it
export const getIsFirstPerson = () => isFirstPerson;
