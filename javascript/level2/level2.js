// import * as THREE from 'three';
// import { Camera } from '../camera';
// import { Renderer } from '../renderer';
// import { Game } from '../game';
// import { Physics, Vehicle } from '../physics';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
// // import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// const loader = new FBXLoader();
// const loader1 = new GLTFLoader()



// const buildPlane = () => {
//     const roadWidth = 256;
//     const roadLength = 256;
//     const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
//     const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
//     const plane = new THREE.Mesh(geometry, material);
//     plane.rotation.x = -Math.PI / 2;
//     return plane;
// };

// const finishPlane = () => {
//     const roadWidth = 8;
//     const roadLength = 2;
//     const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
//     const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
//     const plane = new THREE.Mesh(geometry, material);
//     plane.position.set(45, 0.1, 27.25);
//     plane.rotation.y = -Math.PI / 2;
//     return plane;
// };

// const loadHouseModel = async (path, scale, position) => {
//     return new Promise((resolve, reject) => {
//         const loader = new GLTFLoader();
//         loader.load(path, (gltf) => {
//             const house = gltf.scene;
//             house.scale.set(...scale); // Set scale using spread operator
//             house.position.set(...position); // Set position using spread operator
//             resolve(house);
//         }, undefined, (error) => reject(error));
//     });
// };

// const createHouse = async (modelPath, scale, position, rotation = { x: 0, y: 0, z: 0 }) => {
//     const house = await loadHouseModel(modelPath, scale, position);
//     house.rotation.set(rotation.x, rotation.y, rotation.z); // Apply rotation
//     return house;
// };

// const loadHouses = async (houses) => {

//     const positions = [[-10, 0.1, 25],[-20, 0.1, 25],[0, 0.1, 15],[15, 0.1, 10],[20, 0.1, 15],[25, 0.1, 18],[30, 0.1, 15],[35, 0.1, 22],[40, 0.1, 22],[45, 0.1, 22],[50, 0.1, 21], [55, 0.1, 20], [60, 0.1, 19] ,[65, 0.1, 15]];
//     positions.forEach( async (position) => {
//         houses.push(await createHouse('../../Models/level2/level2-models/boy.glb', [0.6, 0.6, 0.6], position));
//     })

//     const positionsB = [[-30, 0.1, 30],[-35, 0.1, 25],[15, 0.1, 30],[20, 0.1, 33],[25, 0.1, 33],[30, 0.1, 33],[35, 0.1, 33],[40, 0.1, 33],[45, 0.1, 33],[50, 0.1, 33],[55, 0.1, 33],[60, 0.1, 33],[65, 0.1, 33]];

//     positionsB.forEach( async (position) => {
//         houses.push(await createHouse('../../Models/level2/level2-models/tiny_house.glb', [0.6, 0.6, 0.6], position, {x: 0, y: Math.PI, z: 0 }));
//     })

//     const positionsE = [[0, 0.1, 10],   // Near the center
//     [-10, 0.1, 15], // Slightly left of center
//     [10, 0.1, 20],  // Slightly right of center
//     [-5, 0.1, 30],  // Close to center
//     [5, 0.1, 30],   // Close to center
//     [0, 0.1, 35],   // Center
//     [-8, 0.1, 40],  // Slightly left
//     [8, 0.1, 40],   // Slightly right
//     [-3, 0.1, 45],  // Closer to center
//     [3, 0.1, 45],   // Closer to center
//     [0, 0.1, 50],   // Center
//     [-5, 0.1, 55],  // Near center
//     [5, 0.1, 55]]    // Near center];

//     positionsE.forEach( async (position) => {
//         houses.push(await createHouse('../../Models/level2/level2-models/obstacle.glb', [1, 1, 1], position, {x: 0, y: Math.PI, z: 0 }));
//     })


//     const positionsC = [[-75, 0.1, -15],[-65, 0.1, -20],[-55, 0.1, -20],[-45, 0.1, -20],[-35, 0.1, -20],[-25, 0.1, -20],[-15, 0.1, -20],[-5, 0.1, -25],[5, 0.1, -34],[15, 0.1, -34],[25, 0.1, -34],[35, 0.1, -34],[45, 0.1, -34],[55, 0.1, -34],[65, 0.1, -34],[-55, 0.1, 0],[-45, 0.1, 0],[-35, 0.1, 0],[-25, 0.1, 0],[-15, 0.1, 0],[-5, 0.1, 0],[5, 0.1, -10],[15, 0.1, -15],[25, 0.1, -15]];
//     positionsC.forEach( async (position) => {
//         houses.push(await createHouse('../../Models/level2/level2-models/condo.glb', [0.09, 0.09, 0.09], position, {x: 0, y: Math.PI / 2, z: 0 }));
//     })

//     const positionsD = [[15, 0.1, 10],[15, 0.1, 20],[15, 0.1, 30]];
//     positionsD.forEach( async (position) => {
//         houses.push(await createHouse('../../Models/level2/level2-models/old_tree.glb', [1, 1, 1], position));
//     })

//     houses.push(await createHouse('../../Models/level2/level2-models/bar_shack.glb', [0.015, 0.015, 0.015], [10, 0.1, 11]));
//     houses.push(await createHouse('../../Models/level2/level2-models/tree_of_life.glb', [0.5, 0.5, 0.5], [50, 0.1, -10], {x: 0, y: Math.PI / 2, z: 0}));
//     houses.push(await createHouse('../../Models/level2/level2-models/playground.glb', [1.5, 1.5, 1.5], [85, 0.1, -30], {x: 0, y: Math.PI / 2, z: 0}));
    
// }
// //Models/level2/level2-models/track-models/Gravel/GravelPit.glb
// const loadTrackModel = () => {
//     return new Promise((resolve, reject) => {
//         loader.load(
//             '../../Models/level2/level2-models/track-models/drift/Drift.fbx',
//             (fbx) => {
//                 console.log(fbx); // Log the loaded FBX model for inspection
//                 resolve(fbx);
//             },
//             (xhr) => console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`),
//             (error) => reject(error)
//         );
//     });
// };


// // const loadTrack = async (physicsWorld) => {
// //     const model = await loadTrackModel();
// //     const track = model.children[0].children[7];
// //     const textureLoader = new THREE.TextureLoader();
// //     const trackTexture = textureLoader.load('../../Models/level2/level2-models/gravel.jpeg');
// //     const trackMaterial = new THREE.MeshStandardMaterial({ map: trackTexture });
// //     track.scale.set(2, 2, 2);
// //     track.material[4] = trackMaterial;
// //     track.material[5].emissive = 0xffffff;
// //     const t = model.children[0].children[7];
// //     physicsWorld.setPositions(t.geometry.attributes.position.array);
// //     return track;
// // }

// const loadTrack = async (physicsWorld) => {
//     const model = await loadTrackModel();
//     console.log(model); // Inspect the model structure

//     // Check if the children exist and have enough elements
//     if (model.children.length > 0 && model.children[0].children.length > 7) {
//         const track = model.children[0].children[7];

//         const textureLoader = new THREE.TextureLoader();
//         const trackTexture = textureLoader.load('../../Models/level2/level2-models/gravel.jpeg');
//         const trackMaterial = new THREE.MeshStandardMaterial({ map: trackTexture });

//         track.scale.set(2, 2, 2);
//         track.material[4] = trackMaterial;
//         track.material[5].emissive = 0xffffff;

//         physicsWorld.setPositions(track.geometry.attributes.position.array);
//         return track;
//     } else {
//         console.error("Track model structure is not as expected.");
//         return null; // or handle the error accordingly
//     }
// };


// const loadCarModel = async (scene) => {
//     //Models/level2/level2-models/car-models/mazda/mazda_rx7_stylised.glb
//     return new Promise((resolve, reject) => {
//         const loader = new GLTFLoader();
//         loader.load('../../Models/level2/level2-models/car-models/mazda/mazda_rx7_stylised.glb', (gltf) => {
//             const car = gltf.scene;
//             car.scale.set(0.0030, 0.0030, 0.0030);  // Scale car
//             car.position.set(1000, 1000, 1000);  // Position car
//             car.rotateX(-90);  // Rotate car
//             car.traverse((child) => {
//                 if (child.isMesh) {
//                     child.material = new THREE.MeshStandardMaterial({ color: 0x000000 });
//                 }
//             });
//             resolve(car);
//         }, undefined, (error) => reject(error));
//     });
// };

// const addSkybox = (scene) => {
//     const loader = new THREE.CubeTextureLoader();
//     const texture = loader.load([
//         '../../Models/level2/sky/posx.jpg', // Right Models/level2/sky/night.jpeg
//         '../../Models/level2/sky/negx.jpg', // Left
//         '../../Models/level2/sky/posy.jpg', // Top
//         '../../Models/level2/sky/negy.jpg', // Bottom
//         '../../Models/level2/sky/posz.jpg', // Front
//         '../../Models/level2/sky/negz.jpg', // Back ../../Models/level2/sky/night
//     ]);

//     scene.background = texture; // Set the skybox as the scene background
// };

// const loadModels = async (scene, physicsWorld) => {
//     const plane = buildPlane();
//     const car = await loadCarModel(scene);
//     const track = await loadTrack(physicsWorld);
//     physicsWorld.createWorld();
//     const houses = [];
//     await loadHouses(houses);
//     const finish = finishPlane();
//     return { plane, car, track, houses, finish };
// }


// const create3DEnvironment = async () => {
//     const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.1, 100);
//     const renderer = new Renderer();
//     const scene = new THREE.Scene();
//     const controls = new OrbitControls(camera.camera, renderer.domElement);
//     const physicsWorld = new Physics();
//     const physicsCar = new Vehicle();
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     const vehicle = physicsCar.vehicle;
//     const game = new Game(100, vehicle);
//     const { plane, car, track, houses, finish } = await loadModels(scene, physicsWorld);


//     physicsCar.createVehicle();
//     vehicle.addToWorld(physicsWorld.physicsWorld);
//     directionalLight.position.set(10, 10, 10);
//     camera.setPosition(0, 10, 0);
//     renderer.setUpRenderer();

    
//     scene.add(finish);
//     scene.add(plane);
//     scene.add(track);
//     scene.add(car);
//     scene.add(ambientLight);
//     scene.add(directionalLight);
//     addSkybox(scene);
//     houses.forEach(house => scene.add(house));


//     game.startTime();

//     const animate = () => {
//         const boundingBox = new THREE.Box3().setFromObject(car.children[0].children[0].children[0].children[0].children[0].children[0]);
//         const finishBox = new THREE.Box3().setFromObject(finish);


//         window.requestAnimationFrame(animate);
//         physicsWorld.physicsWorld.fixedStep();
//         game.checkState();
//         controls.update();
//         car.position.copy(vehicle.chassisBody.position);
//         car.quaternion.copy(vehicle.chassisBody.quaternion);
//         camera.smoothCameraFollow(car);
//         renderer.renderer.render(scene, camera.camera);


//         if(boundingBox.intersectsBox(finishBox)){
//             game.state = "stopped";
//         }
//     };
//     animate();
// };


// create3DEnvironment();

import * as THREE from 'three';
import { Camera } from '../camera';
import { Renderer } from '../renderer';
import { Game } from './game';
import { Physics, Vehicle } from '../physics';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const loader = new FBXLoader();
const loader1 = new GLTFLoader();

// Add grass plane function
const buildGrassPlane = () => {
    const grassWidth = 512; // Larger than the road
    const grassLength = 512;
    const geometry = new THREE.PlaneGeometry(grassWidth, grassLength);
    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load('../../Models/level2/level2-models/grass.jpeg');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(50, 50);
    
    const material = new THREE.MeshStandardMaterial({ 
        map: grassTexture,
        roughness: 0.8,
        metalness: 0.2
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0.005; // Adjusted position to be at the same height as the road
    return plane;
};


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
            house.scale.set(...scale);
            house.position.set(...position);
            resolve(house);
        }, undefined, (error) => reject(error));
    });
};

const createHouse = async (modelPath, scale, position, rotation = { x: 0, y: 0, z: 0 }) => {
    const house = await loadHouseModel(modelPath, scale, position);
    house.rotation.set(rotation.x, rotation.y, rotation.z);
    return house;
};

// Modified loadHouses with better positioning and added obstacles
const loadHouses = async (houses) => {
    // Additional condo positions
    const condoPositions = [
        [-75, 0.1, -30], [-75, 0.1, -35], [-75, 0.1, -40], [-75, 0.1, -45],
        [-75, 0.1, -50], [-75, 0.1, -55], [-75, 0.1, -60], [-80, 0.1, -40],
        [-96, 0.1, -60], [-105, 0.1, -60], [65, 0.1, -60], [55, 0.1, -60],
        [65, 0.1, -60], [75, 0.1, -60], [85, 0.1, -60],
        [-75, 0.1, -20], [-65, 0.1, -20], [-55, 0.1, -20],
        [-45, 0.1, -20], [-35, 0.1, -20], [-25, 0.1, -20],
        [25, 0.1, -30], [35, 0.1, -35], [45, 0.1, -35]
    ];

    for (const position of condoPositions) {
        houses.push(await createHouse('../../Models/level2/level2-models/tree_gn.glb', [0.2, 0.2, 0.2], position));
    }

    const positions1 = [[-10, 0.1, 25],[-20, 0.1, 25],[0, 0.1, 15],[15, 0.1, 10],[20, 0.1, 15],[25, 0.1, 18],[30, 0.1, 15],[35, 0.1, 22],[40, 0.1, 22],[45, 0.1, 22],[50, 0.1, 21], [55, 0.1, 20], [60, 0.1, 19] ,[65, 0.1, 15]];
    positions1.forEach( async (position) => {
        houses.push(await createHouse('../../Models/level2/level2-models/old_tree.glb', [0.6, 0.6, 0.6], position));
    })

   
    const positions = [[-10, 0.1, 25],[-20, 0.1, 25],[0, 0.1, 15],[15, 0.1, 10],[20, 0.1, 15],
                      [25, 0.1, 18],[30, 0.1, 15],[35, 0.1, 22],[40, 0.1, 22],[45, 0.1, 22],
                      [50, 0.1, 21], [55, 0.1, 20], [60, 0.1, 19] ,[65, 0.1, 15]];
    
    positions.forEach(async (position) => {
        houses.push(await createHouse('../../Models/level2/level2-models/boy.glb', [0.6, 0.6, 0.6], position));
    });

    const positionsB = [[-30, 0.1, 30],[-35, 0.1, 25],[15, 0.1, 30],[20, 0.1, 33],[25, 0.1, 33],[30, 0.1, 33],[35, 0.1, 33],[40, 0.1, 33],[45, 0.1, 33],[50, 0.1, 33],[55, 0.1, 33],[60, 0.1, 33],[65, 0.1, 33]];

    positionsB.forEach( async (position) => {
        houses.push(await createHouse('../../Models/level2/level2-models/condo.glb', [0.2, 0.2, 0.2], position, {x: -3, y: Math.PI, z: 0 }));
    })

    // More obstacles on the track
    const obstaclePositions = [
        [10, 0.1, 15], [-10, 0.1, 25], [15, 0.1, 5], [20, 0.1, -10], 
        [30, 0.1, 35], [35, 0.1, 20], [40, 0.1, -5],
        [-20, 0.1, 10], [-25, 0.1, -20], [-15, 0.1, -30], [12, 0.1, -35], 
        [18, 0.1, 40], [-28, 0.1, 27], [25, 0.1, -40], [16, 0.1, -5],
        [-17, 0.1, 17], [23, 0.1, -15], [31, 0.1, 13], [-34, 0.1, -29], 
        [29, 0.1, -24], [-32, 0.1, -12], [37, 0.1, -8], [15, 0.1, 45], 
        [-19, 0.1, -37], [27, 0.1, -32], [-3, 0.1, 33], [5, 0.1, -28]
    ];
    

    obstaclePositions.forEach(async (position) => {
        const obstacle = await createHouse('../../Models/level2/level2-models/obstacle.glb', 
                                         [1, 1, 1], 
                                         position, 
                                         {x: 0, y: Math.random() * Math.PI * 2, z: 0});
        obstacle.userData.isObstacle = true; 
        houses.push(obstacle);
    });

    // Add more people
    const peoplePositions = [
        [10, 0.1, 10], [15, 0.1, 20], [-5, 0.1, 15], [20, 0.1, 30], 
        [25, 0.1, 35], [30, 0.1, 25], [35, 0.1, 15]
    ];

    peoplePositions.forEach(async (position) => {
        houses.push(await createHouse('../../Models/level2/level2-models/person.glb', [0.6, 0.6, 0.6], position));
    });

    // Restore trees
    const treePositions = [
        [-10, 0.1, 50], [50, 0.1, 15], [10, 0.1, -20], [15, 0.1, -25]
    ];

    treePositions.forEach(async (position) => {
        houses.push(await createHouse('../../Models/level2/level2-models/tree_gn.glb', [0.4, 0.4, 0.4], position));
    });

    // Additional decorative elements
    houses.push(await createHouse('../../Models/level2/level2-models/dustbindrink_cans.glb', [0.015, 0.015, 0.015], [10, 0.1, 11]));
    houses.push(await createHouse('../../Models/level2/level2-models/tree_of_life.glb', [0.5, 0.5, 0.5], [50, 0.1, -10], {x: 0, y: Math.PI / 2, z: 0}));
    houses.push(await createHouse('../../Models/level2/level2-models/playground.glb', [1.5, 1.5, 1.5], [85, 0.1, -30], {x: 0, y: Math.PI / 2, z: 0}));
};
const loadTrackModel = () => {
    return new Promise((resolve, reject) => {
        loader.load(
            '../../Models/level2/level2-models/track-models/formula_track/Formula_Track copy.fbx',
            (fbx) => {
                console.log(fbx);
                resolve(fbx);
            },
            (xhr) => console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`),
            (error) => reject(error)
        );
    });
};

const loadTrack = async (physicsWorld) => {
    const model = await loadTrackModel();
    console.log(model);

    if (model.children.length > 0 && model.children[0].children.length > 7) {
        const track = model.children[0].children[7];
        const textureLoader = new THREE.TextureLoader();
        const trackTexture = textureLoader.load('../../Models/level2/level2-models/gravel.jpeg');
        const trackMaterial = new THREE.MeshStandardMaterial({ map: trackTexture });

        track.scale.set(2, 2, 2);
        track.material[4] = trackMaterial;
        track.material[5].emissive = 0xffffff;

        physicsWorld.setPositions(track.geometry.attributes.position.array);
        return track;
    } else {
        console.error("Track model structure is not as expected.");
        return null;
    }
};

const loadCarModel = async (scene) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('../../Models/level2/level2-models/car-models/mazda/mazda_rx7_stylised.glb', (gltf) => {
            const car = gltf.scene;
            car.scale.set(0.0040, 0.0040, 0.0040);
            car.position.set(1000, 1000, 1000);
            car.rotateX(-90);
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
        '../../Models/level2/sky/posx.jpg',
        '../../Models/level2/sky/negx.jpg',
        '../../Models/level2/sky/posy.jpg',
        '../../Models/level2/sky/negy.jpg',
        '../../Models/level2/sky/posz.jpg',
        '../../Models/level2/sky/negz.jpg',
    ]);
    scene.background = texture;
};

const loadModels = async (scene, physicsWorld) => {
    const plane = buildPlane();
    const car = await loadCarModel(scene);
    const track = await loadTrack(physicsWorld);
    physicsWorld.createWorld();
    const houses = [];
    await loadHouses(houses);
    const finish = finishPlane();
    const grass = buildGrassPlane(); 
    return { plane, car, track, houses, finish, grass };
};

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
    const game = new Game(500, vehicle);
    const { plane, car, track, houses, finish, grass } = await loadModels(scene, physicsWorld);


    let collisionCount = 0;
    const maxCollisions = 3;

    physicsCar.createVehicle();
    vehicle.addToWorld(physicsWorld.physicsWorld);
    directionalLight.position.set(10, 10, 10);
    camera.setPosition(0, 10, 0);
    renderer.setUpRenderer();

    scene.add(grass);  
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
        
        const boundingBox = new THREE.Box3().setFromObject(car).expandByScalar(-0.1); 
        const finishBox = new THREE.Box3().setFromObject(finish);
        const collisionCooldown = 100; 
        let lastCollisionTime = 0; 
    
        houses.forEach(house => {
            if (house.userData.isObstacle) {
               
                const obstacleBox = new THREE.Box3().setFromObject(house).expandByScalar(-0.1);
    
            
                if (boundingBox.intersectsBox(obstacleBox)) {
                    const currentTime = Date.now();
    
                    if (currentTime - lastCollisionTime > collisionCooldown) {
                        collisionCount++;
                        lastCollisionTime = currentTime; 
                        console.log(`Collision ${collisionCount}/${maxCollisions}`);
    
                        if (collisionCount > maxCollisions) {
                            game.state = "dead";
                            window.location.href = 'hitObs.html';
                            console.log("Game Over - Too many collisions!");
                            return;
                        }
                    }
                }
            }
        });
    
        // Check if the car intersects with the finish box
        if (boundingBox.intersectsBox(finishBox)) {
            game.state = "stopped";
            console.log("Finished the race!");
        }
    
        if (game.state === "dead") {
            console.log("Game Over!");
            return;
        }
    
        window.requestAnimationFrame(animate);
        physicsWorld.physicsWorld.fixedStep();
        game.checkState();
        controls.update();
        car.position.copy(vehicle.chassisBody.position);
        car.quaternion.copy(vehicle.chassisBody.quaternion);
        camera.smoothCameraFollow(car);
        renderer.renderer.render(scene, camera.camera);
    };
    
    
    // Start the animation loop
    animate();
}    
create3DEnvironment();