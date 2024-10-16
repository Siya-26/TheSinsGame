import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const moveSpeed = 0.2;
const direction = { x: 0, y: 0, z: 0 };

// Input controls for the cube movement
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


const thirdPersonView = {
    fieldOfView: 75,
    aspect: window.innerWidth / window.innerHeight,
    nearPlane: 0.1,
    farPlane: 100,
};

const buildCube = () => {
    const box = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const cube = new THREE.Mesh(box, material);
    cube.position.set(0, 0.6, 32);
    return cube;
};

const buildGrass = () => {
    const roadWidth = 256;
    const roadLength = 256;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const material = new THREE.MeshBasicMaterial({ color: 0x3F9B0B });
    const grass = new THREE.Mesh(geometry, material);
    grass.rotation.x = -Math.PI / 2;
    return grass;
};

const buildRoad = () => {
    const roadWidth = 8;
    const roadLength = 64;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const material = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(geometry, material);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.1;
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

    const grass = buildGrass();
    const road = buildRoad();
    const cube = buildCube();
    const rightObstacle = buildObstacle();
    const leftObstacle = buildObstacle();

    rightObstacle.position.set(4, 0.1, road.position.z);
    leftObstacle.position.set(-4, 0.1, road.position.z);
    
    scene.add(grass);
    scene.add(road);
    scene.add(leftObstacle);
    scene.add(rightObstacle);
    scene.add(cube);

    camera.position.set(cube.position.x, cube.position.y + 2, cube.position.z + 3);

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
        requestAnimationFrame(animate);


        const oldPosition = cube.position.clone();


        cube.position.x += direction.x;
        cube.position.z += direction.z;

        if (collision(cube, leftObstacle) || collision(cube, rightObstacle)) {
            console.log("Collision!");
            cube.position.copy(oldPosition);
        }


        camera.position.set(cube.position.x, cube.position.y + 2, cube.position.z + 3);
        camera.lookAt(cube.position);

        renderer.render(scene, camera);
    };

    animate();
}

create3DEnvironment();