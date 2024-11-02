import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import Controls from './controls.js';
import { initializeCamera, smoothCameraFollow, toggleCameraView } from './camera.js';
import Time from './time.js';
import { loadCarModel, loadTrack, loadHouseModel, loadSkybox, loadStreetlightModel } from './modelLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';



// GAME PARAMETERS
const frictionCoefficient = 0.02;
const thirdPersonView = {
    fieldOfView: 75,
    aspect: window.innerWidth / window.innerHeight,
    nearPlane: 0.1,
    farPlane: 100,
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

    body.position.set(0, 0.4, 0)
    physicsWorld.addBody(body)
}


// CAMERA FOLLOW LOGIC (Chase View)
// Updated CAMERA FOLLOW LOGIC (Stable Side View)

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

// G A M E   W O R L D

const buildPlane = () => {
    const roadWidth = 256;
    const roadLength = 256;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);

    // Load and apply an icy texture
    const textureLoader = new THREE.TextureLoader();
    const iceTexture = textureLoader.load('../Textures/ice.png'); // Use an ice texture of your choice
    iceTexture.wrapS = THREE.RepeatWrapping;
    iceTexture.wrapT = THREE.RepeatWrapping;
    iceTexture.repeat.set(4, 4);

    const material = new THREE.MeshStandardMaterial({
        map: iceTexture,
        roughness: 0,
        metalness: 0.1,
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    return plane;
};

const finishPlane = () => {
    const roadWidth = 8;
    const roadLength = 2;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const textureLoader = new THREE.TextureLoader();
    const iceTexture = textureLoader.load('../Textures/ice.png'); // Path to your icy texture
    iceTexture.wrapS = THREE.RepeatWrapping;
    iceTexture.wrapT = THREE.RepeatWrapping;
    iceTexture.repeat.set(4, 4);
    
    const material = new THREE.MeshStandardMaterial({
        map: iceTexture,
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.6
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(45, 0.1, 27.25);
    plane.rotation.y = -Math.PI / 2;
    return plane;
};

const createHouse = async (modelPath, scale, position, rotation = { x: 0, y: 0, z: 0 }) => {
    const house = await loadHouseModel(modelPath, scale, position);
    house.rotation.set(rotation.x, rotation.y, rotation.z); 
    house.castShadow = true;
    house.receiveShadow = true;
    return house;
};

// CREATE ENVIRONMENT
const create3DEnvironment = async () => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow mapping
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Set shadow map type
    document.body.appendChild(renderer.domElement);
    
    const camera = initializeCamera(thirdPersonView); 
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true; // Enable zooming
    controls.minDistance = 5;   // Set minimum zoom distance
    controls.maxDistance = 100;  // Set maximum zoom distance
    const scene = new THREE.Scene();

    const pointerControls = new PointerLockControls(camera, document.body);
    document.addEventListener('click', () => {
    pointerControls.lock();
});


    // TOGGLE CAMERA VIEW ON 'P' KEY PRESS
    window.addEventListener('keydown', (event) => {
        if (event.key === 'p' || event.key === 'P') {
            toggleCameraView(); // Toggle view between first and third person
        }
    });

    loadSkybox(scene);

    const createSnow = () => {
        const snowCount = 1500; // Number of snow particles
        const snowGeometry = new THREE.BufferGeometry();
        const snowPositions = [];
    
        for (let i = 0; i < snowCount; i++) {
            snowPositions.push(
                Math.random() * 200 - 100, // X position
                Math.random() * 200,       // Y position (falling height)
                Math.random() * 200 - 100  // Z position
            );
        }
    
        snowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(snowPositions, 3));
    
        const snowMaterial = new THREE.PointsMaterial({
            color: 0xffffff,         // White color for snow
            size: 0.2,               // Adjust size for a snowflake effect
            transparent: true,
            opacity: 0.8,
        });
    
        const snow = new THREE.Points(snowGeometry, snowMaterial);
        scene.add(snow);
    
        // Animate snow fall
        function animateSnow() {
            const positions = snow.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] -= 0.1; // Fall speed for snow
                if (positions[i] < 0) positions[i] = 200; // Reset to top for continuous fall
            }
            snow.geometry.attributes.position.needsUpdate = true;
        }
    
        return animateSnow;
    };
    
    // Add rain animation call in the animate loop
    const animateSnow = createSnow();
    scene.fog = new THREE.FogExp2(0x9db3b5, 0.02);

    const plane = buildPlane();
    const model = await loadTrack();
    const car = await loadCarModel();
    
    // Create an array to hold house models
    const building = [];

    // Old Buildings
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [20, 0.1, 8])); 
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [25, 0.1, 12]));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [30, 0.1, 10]));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [35, 0.1, 18]));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [40, 0.1, 20]));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [45, 0.1, 18]));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [50, 0.1, 15]));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [55, 0.1, 15]));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [60, 0.1, 15]));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [65, 0.1, 10]));

    // Rotated Old Buildings
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [-30, 0.1, 35], {x: 0, y: Math.PI, z: 0 }));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [-35, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [15, 0.1, 30], {x: 0, y: Math.PI, z: 0 }));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [20, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [25, 0.1, 35], {x: 0, y: Math.PI, z: 0 }));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.6, 0.6, 0.6], [30, 0.1, 35], {x: 0, y: Math.PI, z: 0 }));

    // Warehouse Buildings
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-75, 0.1, -15], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-65, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-55, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-45, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-35, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-25, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-15, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-5, 0.1, -25], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [5, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [15, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [25, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [35, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [45, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [55, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [65, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));


    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-55, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-45, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-35, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-25, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-15, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [-5, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [5, 0.1, -10], {x: 0, y: -Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [15, 0.1, -15], {x: 0, y: -Math.PI / 2, z: 0 }));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.2, 0.2, 0.2], [25, 0.1, -15], {x: 0, y: -Math.PI / 2, z: 0 }));

    // Additional Warehouse Buildings - this should be some adverse object
    // building.push(await createHouse('../Models/tree.glb', [0.2, 0.2, 0.2], [35, 0.1, -20], {x: 0, y: -Math.PI / 2, z: 0 }));
    // building.push(await createHouse('../Models/tree.glb', [0.2, 0.2, 0.2], [45, 0.1, -25], {x: 0, y: -Math.PI / 2, z: 0 }));
    // building.push(await createHouse('../Models/crates_set.glb', [0.2, 0.2, 0.2], [55, 0.1, -30], {x: 0, y: -Math.PI / 2, z: 0 }));

    building.push(await createHouse('../Models/warehouse_building.glb', [0.5, 0.5, 0.5], [-90, 0.1, 15], {x: 0, y: Math.PI / 2, z: 0}));
    building.push(await createHouse('../Models/old_building__lowpoly.glb', [0.5, 0.5, 0.5], [-90, 0.1, -5], {x: 0, y: Math.PI / 2, z: 0}));
    building.push(await createHouse('../Models/warehouse_building.glb', [0.5, 0.5, 0.5], [-90, 0.1, 45], {x: 0, y: Math.PI / 2, z: 0}));


    building.push(await createHouse('../Models/suspicious_business_office.glb', [0.5, 0.5, 0.5], [50, 0.1, -10], {x: 0, y: Math.PI / 2, z: 0}));
    building.push(await createHouse('../Models/playground.glb', [1.5, 1.5, 1.5], [85, 0.1, -30], {x: 0, y: Math.PI / 2, z: 0}));

    const track = model.children[0].children[7];
    const textureLoader = new THREE.TextureLoader();
    const trackTexture = textureLoader.load('../Textures/ice.png');
    const trackMaterial = new THREE.MeshStandardMaterial({
        map: trackTexture,
        color: 0xffffff, // Ensures the texture stays white
        roughness: 0.8,
        metalness: 0.2
    });
    track.scale.set(2, 2, 2);
    track.material[1].emissive = 0xB0B0B0;
    track.material[3] = trackMaterial;
    track.material[4] = trackMaterial;
    track.material[5].emissive = 0xB0B0B0;
    //const t = model.children[0].children[7];
    boundaries(track.geometry.attributes.position.array);
    const finish = finishPlane();
    scene.add(finish);

    // Add the plane, track, car to the scene
    scene.add(plane);
    scene.add(track);
    scene.add(car);
    // Add all building to the scene
    building.forEach(house => scene.add(house));

    // L I G H T I N G
    const ambientLight = new THREE.AmbientLight(0x555577, 5); 
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xCCCCCC, 0.4);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    const moonLight = new THREE.DirectionalLight(0xaaaaee, 0.3);
    moonLight.position.set(-30, 50, -30);
    moonLight.castShadow = true; 
    scene.add(moonLight);

    const spotlight = new THREE.SpotLight(0x8888ff, 0.1); // Very dim spotlight for ambient effect
    spotlight.position.set(10, 10, 10); // Adjust position as needed
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.5;
    spotlight.decay = 2;
    spotlight.distance = 50;
    spotlight.castShadow = true;
    scene.add(spotlight);

    //const cannonDebugger = new CannonDebugger(scene, physicsWorld);
    const time = new Time(600, vehicle);
    time.startTime();

    const inputControls = new Controls(vehicle);
    if (time.state === "running") {
        inputControls.enable();
    }

  const waypoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(10, 0, 10),
    new THREE.Vector3(0, 0, 10),
    // Add more waypoints as needed
];



// Track the current waypoint index and completed laps
let currentWaypointIndex = 0;
let completedLaps = 0;

// Function to check if the car is close to the next waypoint
const checkWaypointProgress = (carPosition) => {
    const currentWaypoint = waypoints[currentWaypointIndex];
    const distance = carPosition.distanceTo(currentWaypoint);

    if (distance < 1) { // If close enough to the waypoint
        currentWaypointIndex++; // Move to the next waypoint

        // If all waypoints are completed, reset to the start and increase lap count
        if (currentWaypointIndex >= waypoints.length) {
            currentWaypointIndex = 0; // Reset to first waypoint
            completedLaps++; // Increase lap count
            time.checkWinCondition(completedLaps); // Check for win condition
        }
    }
};

// Inside your animate function, after updating the car's position:
const animate = () => {
    window.requestAnimationFrame(animate);
    physicsWorld.fixedStep();
    //cannonDebugger.update();
    car.position.copy(vehicle.chassisBody.position);
    car.quaternion.copy(vehicle.chassisBody.quaternion);
    controls.update();

    // Check car's position against waypoints
    checkWaypointProgress(car.position);

    // Existing friction handling
    if (!window.keyIsPressed) {
        const velocity = vehicle.chassisBody.velocity;
        velocity.x *= (1 - frictionCoefficient);
        velocity.z *= (1 - frictionCoefficient);
    }

    // Enable or disable input controls based on time state
    if (time.state === "running") {
        inputControls.enable();
    } else {
        inputControls.disable();
    }

    let boundingBox;
    try {
        boundingBox = new THREE.Box3().setFromObject(car);
    } catch (error) {
        console.error("Error accessing car bounding box:", error);
    }

    // Check for collision with the finish line
    const finishBox = new THREE.Box3().setFromObject(finish);
    if (boundingBox && finishBox && boundingBox.intersectsBox(finishBox)) {
        time.state = "stopped";
    }

    animateSnow(); // Adds the continuous rain effect
    

    // Smooth camera follow the car
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