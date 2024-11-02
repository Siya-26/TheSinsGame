import * as THREE from 'three';
import { Camera } from './camera';
import { Renderer } from './renderer';
import { Game } from './game';
import { Physics, Vehicle } from './physics';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
const loader = new FBXLoader();


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

    const positions = [[-10, 0.1, 25],[-20, 0.1, 25],[0, 0.1, 15],[15, 0.1, 10],[20, 0.1, 15],[25, 0.1, 18],[30, 0.1, 15],[35, 0.1, 22],[40, 0.1, 22],[45, 0.1, 22],[50, 0.1, 21], [55, 0.1, 20], [60, 0.1, 19] ,[65, 0.1, 15]];
    positions.forEach( async (position) => {
        houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], position));
    })

    const positionsB = [[-30, 0.1, 30],[-35, 0.1, 25],[15, 0.1, 30],[20, 0.1, 33],[25, 0.1, 33],[30, 0.1, 33],[35, 0.1, 33],[40, 0.1, 33],[45, 0.1, 33],[50, 0.1, 33],[55, 0.1, 33],[60, 0.1, 33],[65, 0.1, 33]];

    positionsB.forEach( async (position) => {
        houses.push(await createHouse('../Models/tiny_house.glb', [0.6, 0.6, 0.6], position, {x: 0, y: Math.PI, z: 0 }));
    })


    const positionsC = [[-75, 0.1, -15],[-65, 0.1, -20],[-55, 0.1, -20],[-45, 0.1, -20],[-35, 0.1, -20],[-25, 0.1, -20],[-15, 0.1, -20],[-5, 0.1, -25],[5, 0.1, -34],[15, 0.1, -34],[25, 0.1, -34],[35, 0.1, -34],[45, 0.1, -34],[55, 0.1, -34],[65, 0.1, -34],[-55, 0.1, 0],[-45, 0.1, 0],[-35, 0.1, 0],[-25, 0.1, 0],[-15, 0.1, 0],[-5, 0.1, 0],[5, 0.1, -10],[15, 0.1, -15],[25, 0.1, -15]];
    positionsC.forEach( async (position) => {
        houses.push(await createHouse('../Models/shanty.glb', [0.2, 0.2, 0.2], position, {x: 0, y: Math.PI / 2, z: 0 }));
    })

    const positionsD = [[15, 0.1, 10],[15, 0.1, 20],[15, 0.1, 30]];
    positionsD.forEach( async (position) => {
        houses.push(await createHouse('../Models/grass.glb', [2, 2, 2], position));
    })

    houses.push(await createHouse('../Models/bar_shack.glb', [0.015, 0.015, 0.015], [10, 0.1, 11]));
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

const loadTrack = async (physicsWorld) => {
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

const addSkybox = (scene) => {
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

const loadModels = async (scene, physicsWorld) => {
    const plane = buildPlane();
    const car = await loadCarModel(scene);
    const track = await loadTrack(physicsWorld);
    physicsWorld.createWorld();
    const houses = [];
    await loadHouses(houses);
    const finish = finishPlane();
    return { plane, car, track, houses, finish };
}


const create3DEnvironment = async () => {
    const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new Renderer();
    const scene = new THREE.Scene();
    const controls = new OrbitControls(camera.camera, renderer.domElement);
    const physicsWorld = new Physics();
    const physicsCar = new Vehicle();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    const vehicle = physicsCar.vehicle;
    const game = new Game(100, vehicle);
    const { plane, car, track, houses, finish } = await loadModels(scene, physicsWorld);


    physicsCar.createVehicle();
    vehicle.addToWorld(physicsWorld.physicsWorld);
    directionalLight.position.set(10, 10, 10);
    camera.setPosition(0, 10, 0);
    renderer.setUpRenderer();

    
    scene.add(finish);
    scene.add(plane);
    scene.add(track);
    scene.add(car);
    scene.add(ambientLight);
    scene.add(directionalLight);
    addSkybox(scene);
    houses.forEach(house => scene.add(house));


    game.startTime();

    const animate = () => {
        const boundingBox = new THREE.Box3().setFromObject(car.children[0].children[0].children[0].children[0].children[0].children[0]);
        const finishBox = new THREE.Box3().setFromObject(finish);


        window.requestAnimationFrame(animate);
        physicsWorld.physicsWorld.fixedStep();
        game.checkState();
        controls.update();
        car.position.copy(vehicle.chassisBody.position);
        car.quaternion.copy(vehicle.chassisBody.quaternion);
        camera.smoothCameraFollow(car);
        renderer.renderer.render(scene, camera.camera);


        if(boundingBox.intersectsBox(finishBox)){
            game.state = "stopped";
        }
    };
    animate();
};


create3DEnvironment();