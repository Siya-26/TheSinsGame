import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

// CONTROLS AND SETUP
const moveSpeed = 0.2;
const direction = { x: 0, y: 0, z: 0 };
const maxSteerVal = Math.PI / 8;
const maxForce = 10;

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
                break
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

const physicsCar = () => {
    const carBody = new CANNON.Body({
        mass: 10,
        shape: new CANNON.Box(new CANNON.Vec3(1, 0.05, 0.5)),
    });

    const vehicle = new CANNON.RigidVehicle({
        chassisBody: carBody,
    });
    
    const axisWidth = 0.5;
    const wheelBody1 = new CANNON.Body({
        mass: 2,
        material: new CANNON.Material('wheel'),
    });
    wheelBody1.addShape(new CANNON.Sphere(0.1));
    wheelBody1.angularDamping = 0.4;
    vehicle.addWheel({
        body: wheelBody1,
        position: new CANNON.Vec3(-1, 0, axisWidth / 1),
        axis: new CANNON.Vec3(0, 0, 1),
        direction: new CANNON.Vec3(0, -1, 0),
    });

    const wheelBody2 = new CANNON.Body({
        mass: 2,
        material: new CANNON.Material('wheel'),
    });
    wheelBody2.addShape(new CANNON.Sphere(0.1));
    wheelBody2.angularDamping = 0.4;
    vehicle.addWheel({
        body: wheelBody2,
        position: new CANNON.Vec3(-1, 0, -axisWidth / 1),
        axis: new CANNON.Vec3(0, 0, 1),
        direction: new CANNON.Vec3(0, -1, 0),
    });

    const wheelBody3 = new CANNON.Body({
        mass: 2,
        material: new CANNON.Material('wheel'),
    });
    wheelBody3.addShape(new CANNON.Sphere(0.1));
    wheelBody3.angularDamping = 0.4;
    vehicle.addWheel({
        body: wheelBody3,
        position: new CANNON.Vec3(1, 0, -axisWidth / 1),
        axis: new CANNON.Vec3(0, 0, 1),
        direction: new CANNON.Vec3(0, -1, 0),
    });

    const wheelBody4 = new CANNON.Body({
        mass: 2,
        material: new CANNON.Material('wheel'),
    });
    wheelBody4.addShape(new CANNON.Sphere(0.1));
    wheelBody4.angularDamping = 0.4;
    vehicle.addWheel({
        body: wheelBody4,
        position: new CANNON.Vec3(1, 0, axisWidth / 1),
        axis: new CANNON.Vec3(0, 0, 1),
        direction: new CANNON.Vec3(0, -1, 0),
    });

    return { vehicle, wheelBody1, wheelBody2, wheelBody4, wheelBody3 };
}

const {vehicle, wheelBody1, wheelBody2, wheelBody4, wheelBody3} = physicsCar();


enableInputControls(vehicle);

vehicle.addToWorld(physicsWorld);

// GAME WORLD
const thirdPersonView = {
    fieldOfView: 75,
    aspect: window.innerWidth / window.innerHeight,
    nearPlane: 0.1,
    farPlane: 100,
};

const buildPlane = () => {
    const roadWidth = 256;
    const roadLength = 256;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const wireframe_geo = new THREE.PlaneGeometry(roadWidth, roadLength, 256, 256);
    const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const wireframe_mat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true
    });
    const plane_wireframe = new THREE.Mesh(wireframe_geo, wireframe_mat);
    const plane = new THREE.Mesh(geometry, material);
    plane.add(plane_wireframe)
    plane.rotation.x = -Math.PI / 2;
    return plane;
};

const loader = new FBXLoader();

const loadTrack = () => {
    return new Promise((resolve, reject) => {
        loader.load(
            '../Models/Formula_Track.fbx',
            (fbx) => {
                resolve(fbx);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error occurred:', error);
                reject(error);
            }
        );
    });
};

const loadCarModel = (scene) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('../Models/mazda_rx7_stylised.glb', (gltf) => {
            const car = gltf.scene;

            // Scale the car down significantly
            car.scale.set(0.0040, 0.0040, 0.0040);  // Scale car to 15% of its original size

            // Position the car at the start of the track (z = 0)
            car.position.set(0, 0.1, -10);  // Position the car at the beginning of the track
            car.rotateY(47.2);

            // Change car's color to white and enable wireframe mode
            car.traverse((child) => {
                if (child.isMesh) {
                    child.material.color.set(0xffffff);  // Set all meshes to white
                    child.material.wireframe = false;     // Enable wireframe mode
                }
            });

            car.traverse((child) => {
                if (child.isMesh) {
                    child.material.color.set(0x000000);  // Set all meshes to white
                }
            });

            // Optional: Set shadows if needed
            car.castShadow = false;
            car.receiveShadow = false;

            // Rotate the car to face the road
            car.rotation.y -= Math.PI / 2;

            resolve(car);  // Resolve the promise with the loaded car
        }, undefined, (error) => {
            reject(error);  // Reject the promise if there's an error
        });
    });
};

const buildBox = () => {
    const geo = new THREE.BoxGeometry(2, 0.1, 1);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: true
    });
    const box_mesh = new THREE.Mesh(geo, mat);
    return box_mesh
}

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

    camera.position.set(0, 5, 10);

    const controls = new OrbitControls(camera, renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('0xFFFFFF');

    const plane = buildPlane();
    const model = await loadTrack();
    const car = await loadCarModel(scene);
    const box = buildBox();
    const track = model.children[0].children[7];
    track.scale.set(2, 2, 2);
    for(let i = 0; i < track.material.length; i++){
        track.material[i].emissive.set(0x07030A);
    }

    scene.add(plane);
    scene.add(track);
    scene.add(car);
    //scene.add(box);

    const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
        // color: 0xff0000
    });
    const animate = () => {
        window.requestAnimationFrame(animate);
        physicsWorld.fixedStep();
        cannonDebugger.update();
        car.position.copy(vehicle.chassisBody.position);
        car.quaternion.copy(vehicle.chassisBody.quaternion);

        renderer.render(scene, camera);
    };

    animate();
};


create3DEnvironment();
