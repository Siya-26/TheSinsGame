import * as THREE from 'three';

// Camera Offsets
const thirdPersonOffset = new THREE.Vector3(0, 5, -15);
const behindCarOffset = new THREE.Vector3(0, 2, -7);
let currentView = 'thirdPerson';

// Initialize the Camera
export const initializeCamera = (aspect) => {
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 5, 10);
    return camera;
};

// Toggle Camera Views
export const enableCameraToggle = () => {
    window.addEventListener('keydown', (event) => {
        if (event.key === 'v' || event.key === 'V') {
            currentView = currentView === 'thirdPerson' ? 'behindCar' : 'thirdPerson';
        }
    });
};

// Toggle between views on 'V' key press
export const getActiveOffset = () => {
    return currentView === 'thirdPerson' ? thirdPersonOffset : behindCarOffset;
};


// Update the Camera Each Frame
export const updateCamera = (camera, vehicle) => {
    // Get the car's position from the physics world
    const carPosition = new THREE.Vector3(
        vehicle.chassisBody.position.x,
        vehicle.chassisBody.position.y,
        vehicle.chassisBody.position.z
    );

    // Get the car's orientation (quaternion) from Cannon.js
    const carQuaternion = new THREE.Quaternion(
        vehicle.chassisBody.quaternion.x,
        vehicle.chassisBody.quaternion.y,
        vehicle.chassisBody.quaternion.z,
        vehicle.chassisBody.quaternion.w
    );

    // Define the forward direction in car's local space (positive X-axis)
    const forward = new THREE.Vector3(1, 0, 0); // Local forward axis
    forward.applyQuaternion(carQuaternion); // Transform to world space

    // Calculate the camera position behind the car (negative forward direction)
    const offset = getActiveOffset(); // Use 'thirdPerson' or 'behindCar' offset
    const worldOffset = forward.multiplyScalar(-offset.z).add(new THREE.Vector3(0, offset.y, 0)); 

    // Compute the desired camera position in world space
    const desiredPosition = carPosition.clone().add(worldOffset);

    // Smoothly interpolate the camera position to avoid jerky movement
    camera.position.lerp(desiredPosition, 0.1);

    // Ensure the camera stays upright
    camera.up.lerp(new THREE.Vector3(0, 1, 0), 0.1);

    // Make the camera smoothly look at the car's current position
    camera.lookAt(carPosition);
};
