import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const thirdPersonView = {
    fieldOfView: 75,
    aspect: window.innerWidth / window.innerHeight,
    nearPlane: 0.1,
    farPlane: 100,
    cameraPositionX: 0,
    cameraPositionY: 5,
    cameraPositionZ: 20
};

const buildRoad = () => {
    const roadWidth = 8;
    const roadLength = 64;
    const geometry = new THREE.PlaneGeometry(roadWidth, roadLength);
    const material = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(geometry, material);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0;
    return road;
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
    camera.position.set(
        thirdPersonView.cameraPositionX,
        thirdPersonView.cameraPositionY,
        thirdPersonView.cameraPositionZ
    );
  
    const scene = new THREE.Scene();
    scene.add(buildRoad());

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();
}

create3DEnvironment();
