import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { strToU8 } from 'three/examples/jsm/libs/fflate.module.js';
import { load } from 'three/examples/jsm/libs/opentype.module.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const moveSpeed = 0.2;
const direction = { x: 0, y: 0, z: 0 };

const enableInputControls = () => {
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                direction.z = -moveSpeed;
                break;
            case 'ArrowDown':
            case 's':
                direction.z = moveSpeed;
                break;
            case 'ArrowLeft':
            case 'a':
                direction.x = -moveSpeed;
                break;
            case 'ArrowRight':
            case 'd':
                direction.x = moveSpeed;
                break;
        }
    });
    
    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'ArrowDown':
            case 's':
                direction.z = 0;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'ArrowRight':
            case 'd':
                direction.x = 0;
                break;
        }
    });
}

const thirdPersonView = {
    fieldOfView: 75,
    aspect: window.innerWidth / window.innerHeight,
    nearPlane: 0.1,
    farPlane: 100,
};

const buildCube = () => {
    const box = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const wireframe_box = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
    const wireframe_material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true
    });
    const wireframe = new THREE.Mesh(wireframe_box, wireframe_material);
    const cube = new THREE.Mesh(box, material);
    cube.add(wireframe);
    cube.position.set(0, 0.6, 32);
    return cube;
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

const buildRoad = () => {
    const roadWidth = 8;
    const roadLength = 64;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x333333,
        side: THREE.DoubleSide
     });
    const road = new THREE.Mesh(geometry, material);
    return road;
};

const collision = (cube, obstacle) => {
    const cubeBox = new THREE.Box3().setFromObject(cube);
    const obstacleBox = new THREE.Box3().setFromObject(obstacle);
    return cubeBox.intersectsBox(obstacleBox);
};

const buildObstacle = () => {
    const plane = new THREE.PlaneGeometry(64, 5);
    const material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.0
    });
    const obstacle = new THREE.Mesh(plane, material);
    obstacle.rotation.y = -Math.PI / 2;
    return obstacle;
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
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false; // Prevent panning to prevent disorienting movements

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('0xFFFFFF');

    const plane = buildPlane();
    scene.add(plane);
    const model = await loadTrack();
    const track = model.children[0].children[7];
    for(let i = 0; i < track.material.length; i++){
        track.material[i].emissive.set(0x07030A);
    }
    console.log(track);
    scene.add(track);

    const animate = () => {
        requestAnimationFrame(animate);
        controls.update(); // Update the controls on each frame
        renderer.render(scene, camera);
    };

    animate();
};


create3DEnvironment();
