import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

const buildTrack = () => {
    const track = new THREE.Group();
    const main = buildRoad();
    const main_right = buildRoad();
    track.add(main);
    track.rotation.x = -Math.PI / 2;
    track.position.y = 0.1;
    return track;
}

const create3DEnvironment = () => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        thirdPersonView.fieldOfView,
        thirdPersonView.aspect,
        thirdPersonView.nearPlane,
        thirdPersonView.farPlane
    );

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('0xFFFFFF');

    const plane = buildPlane();
    const cube = buildCube();
    const track = buildTrack();
    
    scene.add(plane);
    scene.add(track);
    scene.add(cube);

    camera.position.set(cube.position.x, cube.position.y + 2, cube.position.z + 3);

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
        requestAnimationFrame(animate);


        const oldPosition = cube.position.clone();


        cube.position.x += direction.x;
        cube.position.z += direction.z;


        //camera.position.set(cube.position.x, cube.position.y + 2, cube.position.z + 3);
        //camera.lookAt(cube.position);

        renderer.render(scene, camera);
    };

    animate();
}

create3DEnvironment();