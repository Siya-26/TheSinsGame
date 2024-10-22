import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
const loader = new FBXLoader();

class Time {
    constructor(time) {
        this.time = time;
        this.state = "start";
        this.count = 3;
        this.countdownInterval = null;
        this.timerInterval = null;
    }


    stopTime() {
        if (this.time === 0 && this.state === "running") {
            clearInterval(this.timerInterval);
            this.state = "stopped";
            window.location.href = 'lostScreen1.html';
        }
        else if(this.time != 0 && this.state === "stopped"){
            clearInterval(this.countdownInterval);
            window.location.href = '../html/winScreen1.html';
        }
    }
    

    runTime() {
        this.state = "running";
        this.timerInterval = setInterval(() => {
            this.time -= 1;
            document.getElementById('stopwatch').innerText = this.time;
            this.stopTime();
        }, 1000);
    }


    startTime() {
        this.countdownInterval = setInterval(() => {
            this.count -= 1;
            console.log(this.count);
            document.getElementById('countdown').innerText = this.count;

            if (this.count === 0) {
                clearInterval(this.countdownInterval);
                document.getElementById('countdown').innerText = '';
                this.runTime();
            }
        }, 1000);
    }
}

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

const disableInputControls = (vehicle) => {
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                vehicle.setWheelForce(0, 0);
                vehicle.setWheelForce(0, 1);
                break;
            case 'ArrowDown':
            case 's':
                vehicle.setWheelForce(0, 0);
                vehicle.setWheelForce(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
                vehicle.setSteeringValue(0, 0);
                vehicle.setSteeringValue(0, 1);
                break;
            case 'ArrowRight':
            case 'd':
                vehicle.setSteeringValue(0, 0);
                vehicle.setSteeringValue(0, 1);
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

const maxSteerVal = Math.PI / 8;
const maxForce = 10;
const frictionCoefficient = 0.05;

class Physics{
    constructor(){
        this.physicsWorld = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0),
        });
        this.groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        this.positions = [];
    }


    setPositions(positions){
        this.positions = positions;
    }


    addGround(){
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.physicsWorld.addBody(this.groundBody);
    }


    addBoundaries(){
        const mass = 1000;
        const body = new CANNON.Body({ mass });
        const s = 2;
        for(let i = 9171; i < 18133; i += 3){
            const sphereShape = new CANNON.Sphere(0.25);
            body.addShape(sphereShape, new CANNON.Vec3(this.positions[i]*s, this.positions[i+1]*s, this.positions[i+2]*s));
        }
        for(let i = 63117; i < 72115; i += 3){
            const sphereShape = new CANNON.Sphere(0.25);
            body.addShape(sphereShape, new CANNON.Vec3(this.positions[i]*s, this.positions[i+1]*s, this.positions[i+2]*s));
        }
    
        body.position.set(0, 0.5, 0)
        this.physicsWorld.addBody(body)
    }


    createWorld(){
        this.addGround();
        this.addBoundaries();
    }
}

const physicsWorld = new Physics();


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
vehicle.addToWorld(physicsWorld.physicsWorld);


const buildPlane = () => {
    const roadWidth = 256;
    const roadLength = 256;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    return plane;
};

const finishPlane = () => {
    const roadWidth = 8;
    const roadLength = 2;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(45, 0.1, 27.25);
    plane.rotation.y = -Math.PI / 2;
    return plane;
};

const loadHouseModel = async (path, scale, position) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
            const house = gltf.scene;
            house.scale.set(...scale); // Set scale using spread operator
            house.position.set(...position); // Set position using spread operator
            resolve(house);
        }, undefined, (error) => reject(error));
    });
};

const createHouse = async (modelPath, scale, position, rotation = { x: 0, y: 0, z: 0 }) => {
    const house = await loadHouseModel(modelPath, scale, position);
    house.rotation.set(rotation.x, rotation.y, rotation.z); // Apply rotation
    return house;
};

const loadHouses = async (houses) => {
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [-10, 0.1, 25]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [-20, 0.1, 25]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [0, 0.1, 15]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [15, 0.1, 10]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [20, 0.1, 15]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [25, 0.1, 18]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [30, 0.1, 15]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [35, 0.1, 22]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [40, 0.1, 22]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [45, 0.1, 22]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [50, 0.1, 21]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [55, 0.1, 20]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [60, 0.1, 19]));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [65, 0.1, 15]));

    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [-30, 0.1, 30], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [-35, 0.1, 25], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [15, 0.1, 30], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [20, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [25, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [30, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [35, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [40, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [45, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [50, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [55, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [60, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));
    houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], [65, 0.1, 33], {x: 0, y: Math.PI, z: 0 }));


    //Shanty House
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-75, 0.1, -15], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-65, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-55, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-45, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-35, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-25, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-15, 0.1, -20], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-5, 0.1, -25], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [5, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [15, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [25, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [35, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [45, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [55, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [65, 0.1, -34], {x: 0, y: Math.PI / 2, z: 0 }));

    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-55, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-45, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-35, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-25, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-15, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [-5, 0.1, 0], {x: 0, y: -Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [5, 0.1, -10], {x: 0, y: -Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [15, 0.1, -15], {x: 0, y: -Math.PI / 2, z: 0 }));
    houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], [25, 0.1, -15], {x: 0, y: -Math.PI / 2, z: 0 }));

    houses.push(await createHouse('../Models/bar_shack.glb', [0.015, 0.015, 0.015], [10, 0.1, 11]));
    houses.push(await createHouse('../Models/grass.glb', [2, 2, 2], [15, 0.1, 10]));
    houses.push(await createHouse('../Models/grass.glb', [2, 2, 2], [15, 0.1, 20]));
    houses.push(await createHouse('../Models/grass.glb', [2, 2, 2], [15, 0.1, 30]));
    houses.push(await createHouse('../Models/soccer_field.glb', [0.5, 0.5, 0.5], [50, 0.1, -10], {x: 0, y: Math.PI / 2, z: 0}));
    houses.push(await createHouse('../Models/playground.glb', [1.5, 1.5, 1.5], [85, 0.1, -30], {x: 0, y: Math.PI / 2, z: 0}));
}

const loadTrackModel = () => {
    return new Promise((resolve, reject) => {
        loader.load(
            '../Models/Formula_Track.fbx',
            (fbx) => resolve(fbx),
            (xhr) => console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`),
            (error) => reject(error)
        );
    });

};

const loadTrack = async () => {
    const model = await loadTrackModel();
    const track = model.children[0].children[7];
    const textureLoader = new THREE.TextureLoader();
    const trackTexture = textureLoader.load('../Models/road.jpg');
    const trackMaterial = new THREE.MeshStandardMaterial({ map: trackTexture });
    track.scale.set(2, 2, 2);
    track.material[4] = trackMaterial;
    track.material[5].emissive = 0xffffff;
    const t = model.children[0].children[7];
    physicsWorld.setPositions(t.geometry.attributes.position.array);
    return track;
}

const loadCarModel = async (scene) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('../Models/mazda_rx7_stylised.glb', (gltf) => {
            const car = gltf.scene;
            car.scale.set(0.0030, 0.0030, 0.0030);  // Scale car
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

// CAMERA FUNCTIONS

let isFirstPerson = false;
const smoothFactor = 0.2;
const fixedCameraY = 2;
const thirdPersonOffset = new THREE.Vector3(-3, 2, 0);
const firstPersonOffset = new THREE.Vector3(1, 1, 0);

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

window.addEventListener('keydown', (event) => {
    if (event.key === 'p' || event.key === 'P') {
        isFirstPerson = !isFirstPerson; // Toggle between 1st and 3rd person
    }
});

// BUILD WORLD

const create3DEnvironment = async () => {

    // SCENE + CAMERA + RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100,);
    camera.position.set(0, 10, 0);
    const controls = new OrbitControls(camera, renderer.domElement);
    const scene = new THREE.Scene();


    // LOAD MODELS 
    loadSkybox(scene);
    const plane = buildPlane();
    const car = await loadCarModel(scene);
    const track = await loadTrack();
    const houses = [];
    await loadHouses(houses);
    const finish = finishPlane();


    // SCENE ADD
    scene.add(finish);
    scene.add(plane);
    scene.add(track);
    scene.add(car);
    houses.forEach(house => scene.add(house));
    physicsWorld.createWorld();


    // L I G H T I N G
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // OTHERS
    //const cannonDebugger = new CannonDebugger(scene, physicsWorld);
    const time = new Time(100, vehicle);
    time.startTime();


    const animate = () => {
        window.requestAnimationFrame(animate);
        physicsWorld.physicsWorld.fixedStep();
        //cannonDebugger.update();
        car.position.copy(vehicle.chassisBody.position);
        car.quaternion.copy(vehicle.chassisBody.quaternion);
        controls.update();

    
        if (!window.keyIsPressed) {
            const velocity = vehicle.chassisBody.velocity;
            velocity.x *= (1 - frictionCoefficient);
            velocity.z *= (1 - frictionCoefficient);
        }

        // Enable or disable input controls based on time state
        if (time.state === "running") {
            enableInputControls(vehicle);
        } else {
            disableInputControls(vehicle);
        }

        const boundingBox = new THREE.Box3().setFromObject(car.children[0].children[0].children[0].children[0].children[0].children[0]);
        const finishBox = new THREE.Box3().setFromObject(finish);
        if(boundingBox.intersectsBox(finishBox)){
            time.state = "stopped";
        }

        smoothCameraFollow(camera, car);
        renderer.render(scene, camera);
    };
    animate();
};


window.keyIsPressed = false;
window.addEventListener('keydown', () => { window.keyIsPressed = true; });
window.addEventListener('keyup', () => { window.keyIsPressed = false; });

create3DEnvironment();