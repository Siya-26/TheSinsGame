import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

// GAME PARAMETERS
const maxSteerVal = Math.PI / 8;
const maxForce = 10;
const frictionCoefficient = 0.05;
const thirdPersonView = {
    fieldOfView: 75,
    aspect: window.innerWidth / window.innerHeight,
    nearPlane: 0.1,
    farPlane: 100,
};

// INPUT CONTROLS
const enableInputControls = (vehicle) => {
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                vehicle.setWheelForce(maxForce, 0);
                vehicle.setWheelForce(maxForce, 1);
                break;
            case 'ArrowDown':
            case 's':
                vehicle.setWheelForce(-maxForce / 2, 0);
                vehicle.setWheelForce(-maxForce / 2, 1);
                break;
            case 'ArrowLeft':
            case 'a':
                vehicle.setSteeringValue(maxSteerVal, 0);
                vehicle.setSteeringValue(maxSteerVal, 1);
                break;
            case 'ArrowRight':
            case 'd':
                vehicle.setSteeringValue(-maxSteerVal, 0);
                vehicle.setSteeringValue(-maxSteerVal, 1);
                break;
        }
    });
    
    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                vehicle.setWheelForce(0, 0);
                vehicle.setWheelForce(0, 1);
                break;
            case 's':
            case 'ArrowDown':
                vehicle.setWheelForce(0, 0);
                vehicle.setWheelForce(0, 1);
                break;
            case 'a':
            case 'ArrowLeft':
                vehicle.setSteeringValue(0, 0);
                vehicle.setSteeringValue(0, 1);
                break;
            case 'd':
            case 'ArrowRight':
                vehicle.setSteeringValue(0, 0);
                vehicle.setSteeringValue(0, 1);
                break;
        }
    });
};

// PHYSICS WORLD
const physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
});

const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(groundBody);

// WHEEL CREATION FUNCTION (Refactored)
const addWheel = (vehicle, position, axisWidth) => {
    const wheelBody = new CANNON.Body({
        mass: 2,
        material: new CANNON.Material('wheel'),
    });
    wheelBody.addShape(new CANNON.Sphere(0.1));
    wheelBody.angularDamping = 0.4;
    vehicle.addWheel({
        body: wheelBody,
        position: new CANNON.Vec3(position.x, 0, position.z * axisWidth),
        axis: new CANNON.Vec3(0, 0, 1),
        direction: new CANNON.Vec3(0, -1, 0),
    });
    return wheelBody;
};

const physicsCar = () => {
    const carBody = new CANNON.Body({
        mass: 20,
        shape: new CANNON.Box(new CANNON.Vec3(1, 0.05, 0.5)),
        position: new CANNON.Vec3(40, 0.1, 27.25),
    });

    const vehicle = new CANNON.RigidVehicle({
        chassisBody: carBody,
    });

    const axisWidth = 0.5;
    const wheelBody1 = addWheel(vehicle, { x: -1, z: 1 }, axisWidth);
    const wheelBody2 = addWheel(vehicle, { x: -1, z: -1 }, axisWidth);
    const wheelBody3 = addWheel(vehicle, { x: 1, z: -1 }, axisWidth);
    const wheelBody4 = addWheel(vehicle, { x: 1, z: 1 }, axisWidth);

    return { vehicle, wheelBody1, wheelBody2, wheelBody3, wheelBody4 };
};

const { vehicle, wheelBody1, wheelBody2, wheelBody3, wheelBody4 } = physicsCar();
enableInputControls(vehicle);
vehicle.addToWorld(physicsWorld);

const boundaries = (positions) => {
    const mass = 1000;
    const body = new CANNON.Body({ mass });
    const s = 2;

    for(let i = 9171; i < 18133; i += 3){
        const sphereShape = new CANNON.Sphere(0.25);
        body.addShape(sphereShape, new CANNON.Vec3(positions[i]*s, positions[i+1]*s, positions[i+2]*s));
    }
    for(let i = 63117; i < 72115; i += 3){
        const sphereShape = new CANNON.Sphere(0.25);
        body.addShape(sphereShape, new CANNON.Vec3(positions[i]*s, positions[i+1]*s, positions[i+2]*s));
    }

    body.position.set(0, 0.5, 0)
    physicsWorld.addBody(body)
}


// CAMERA FOLLOW LOGIC (Chase View)
// Updated CAMERA FOLLOW LOGIC (Stable Side View)
const cameraOffset = new THREE.Vector3(-3, 2, 0); // Position to the side of the car
const smoothFactor = 0.2; // Factor for smooth camera follow
const fixedCameraY = 2; // Fixed height for the camera

// const smoothCameraFollow = (camera, car) => {
//     // Update camera position based on car's rotation
//     const carDirection = new THREE.Vector3();
//     car.getWorldDirection(carDirection); // Get the car's forward direction
//     const carRight = new THREE.Vector3().crossVectors(carDirection, new THREE.Vector3(0, 1, 0)).normalize(); // Get the right direction of the car

//     // Calculate the target position for the camera
//     const targetPosition = car.position
//         .clone()
//         .add(carRight.clone().multiplyScalar(cameraOffset.x)) // Move to the side
//         .setY(fixedCameraY); // Set a fixed height for the camera

//     // Smoothly interpolate camera position
//     camera.position.lerp(targetPosition, smoothFactor);

//     // Make the camera look at the car
//     camera.lookAt(car.position);
// };

// SCENE SETUP (Optimized with Lazy Loading)

const buildPlane = () => {
    const roadWidth = 256;
    const roadLength = 256;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    return plane;
};

const loader = new FBXLoader();

const loadTrack = () => {
    return new Promise((resolve, reject) => {
        loader.load(
            '../Models/Formula_Track.fbx',
            (fbx) => resolve(fbx),
            (xhr) => console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`),
            (error) => reject(error)
        );
    });

};

const loadCarModel = async (scene) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('../Models/mazda_rx7_stylised.glb', (gltf) => {
            const car = gltf.scene;
            car.scale.set(0.0040, 0.0040, 0.0040);  // Scale car
            car.position.set(1000, 1000, 1000);  // Position car
            car.rotateX(-90);  // Rotate car
            car.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({ color: 0x000000 });
                }
            });
            resolve(car);
        }, undefined, (error) => reject(error));
    });
};

const loadSkybox = (scene) => {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '../skybox/px.png', // Right
        '../skybox/nx.png', // Left
        '../skybox/py.png', // Top
        '../skybox/ny.png', // Bottom
        '../skybox/pz.png', // Front
        '../skybox/nz.png', // Back
    ]);

    scene.background = texture; // Set the skybox as the scene background
};

let isFirstPerson = false; // Start with 3rd person by default

// CAMERA OFFSET FOR BOTH VIEWS
const thirdPersonOffset = new THREE.Vector3(-3, 2, 0); // Third-person view (chase view)
const firstPersonOffset = new THREE.Vector3(1, 1, 0); // First-person view (inside car)

// SMOOTH CAMERA FOLLOW FUNCTION (Updated to support both views)
const smoothCameraFollow = (camera, car) => {
    if (isFirstPerson) {
        // 1st person view: Position camera inside the car
        const targetPosition = car.position.clone().add(firstPersonOffset);
        camera.position.lerp(targetPosition, smoothFactor);
    } else {
        // 3rd person view: Chase view logic
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

// TOGGLE CAMERA VIEW ON 'P' KEY PRESS
window.addEventListener('keydown', (event) => {
    if (event.key === 'p' || event.key === 'P') {
        isFirstPerson = !isFirstPerson; // Toggle between 1st and 3rd person
    }
});

// CREATE ENVIRONMENT
const create3DEnvironment = async () => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        thirdPersonView.fieldOfView,
        thirdPersonView.aspect,
        thirdPersonView.nearPlane,
        thirdPersonView.farPlane
    );
    camera.position.set(0, 10, 0);

    const controls = new OrbitControls(camera, renderer.domElement);

    const scene = new THREE.Scene();

    loadSkybox(scene);

    // B U I L D I N G   M E S H E S
    const plane = buildPlane();
    const model = await loadTrack();
    const car = await loadCarModel(scene);
    const track = model.children[0].children[7];
    const textureLoader = new THREE.TextureLoader();
    const trackTexture = textureLoader.load('../Models/road.jpg');
    const trackMaterial = new THREE.MeshStandardMaterial({ map: trackTexture });
    track.scale.set(2, 2, 2);
    track.material[4] = trackMaterial;
    track.material[5].emissive = 0xffffff;
    const t = model.children[0].children[7];
    boundaries(t.geometry.attributes.position.array);
    //console.log(t.geometry.attributes.position.array.length);

    scene.add(plane);
    scene.add(track);
    scene.add(car);

    // L I G H T I N G
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const cannonDebugger = new CannonDebugger(scene, physicsWorld);

    const animate = () => {
        window.requestAnimationFrame(animate);
        physicsWorld.fixedStep();
        cannonDebugger.update();
        car.position.copy(vehicle.chassisBody.position);
        car.quaternion.copy(vehicle.chassisBody.quaternion);
        controls.update();
        if (!window.keyIsPressed) {
            const velocity = vehicle.chassisBody.velocity;
            velocity.x *= (1 - frictionCoefficient);
            velocity.z *= (1 - frictionCoefficient);
        }

        // Smooth camera follow the car (chase view)
        smoothCameraFollow(camera, car);

        // Render the scene
        renderer.render(scene, camera);
    };

    animate();
};

window.keyIsPressed = false;
window.addEventListener('keydown', () => { window.keyIsPressed = true; });
window.addEventListener('keyup', () => { window.keyIsPressed = false; });

create3DEnvironment();
