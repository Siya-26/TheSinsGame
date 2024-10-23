import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';
import { enableInputControls } from './controls';
import { initializeCamera, enableCameraToggle, updateCamera } from './camera';
import { createNoise2D } from 'simplex-noise';
import { createFinishLineArch } from './finishline';
import { loadTrackModel } from './model';

// Constants
const maxSteerVal = Math.PI / 16;
const maxForce = 50;
const tileSize = 256;
const gridSize = 3;

// Physics World Setup
const physicsWorld = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });

const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(groundBody);

const physicsCar = () => {
    const carBody = new CANNON.Body({
        mass: 50,
        shape: new CANNON.Box(new CANNON.Vec3(1, 0.1, 0.5)),
    });

    carBody.position.set(0, 0, -10);
    carBody.linearDamping = 0.1;
    carBody.angularDamping = 0.4;

    const wheelMaterial = new CANNON.Material('wheel');
    const groundMaterial = new CANNON.Material('ground');

    const wheelGroundContact = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
        friction: 0.7,
        restitution: 0,
    });

    physicsWorld.addContactMaterial(wheelGroundContact);

    const vehicle = new CANNON.RigidVehicle({ chassisBody: carBody });
    vehicle.wheelBodies = [];

    const wheelBodies = Array(4).fill().map(() => {
        const wheelBody = new CANNON.Body({ mass: 2, material: wheelMaterial });
        wheelBody.addShape(new CANNON.Sphere(0.25));
        vehicle.wheelBodies.push(wheelBody);
        return wheelBody;
    });

    const axisWidth = 0.8;
    wheelBodies.forEach((wheelBody, i) => {
        const offset = i < 2 ? -1.2 : 1.2;
        const side = i % 2 === 0 ? axisWidth : -axisWidth;

        vehicle.addWheel({
            body: wheelBody,
            position: new CANNON.Vec3(offset, -0.1, side),
            axis: new CANNON.Vec3(0, 0, 1),
            direction: new CANNON.Vec3(0, -1, 0),
        });
    });

    return vehicle;
};

const vehicle = physicsCar();
enableInputControls(vehicle, maxForce, maxSteerVal);
vehicle.addToWorld(physicsWorld);

const camera = initializeCamera(window.innerWidth / window.innerHeight);
enableCameraToggle();

const terrainTiles = [];
const createTerrainTiles = (scene) => {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const tile = buildPlane();
            tile.position.set(i * tileSize, 0, j * tileSize);
            tile.receiveShadow = true;
            scene.add(tile);
            terrainTiles.push(tile);
        }
    }
};

const updateTerrainTiles = (carPosition) => {
    const threshold = tileSize / 2;
    terrainTiles.forEach((tile) => {
        const distanceX = Math.abs(carPosition.x - tile.position.x);
        const distanceZ = Math.abs(carPosition.z - tile.position.z);

        if (distanceX > threshold * gridSize) {
            tile.position.x += Math.sign(carPosition.x - tile.position.x) * tileSize * gridSize;
        }
        if (distanceZ > threshold * gridSize) {
            tile.position.z += Math.sign(carPosition.z - tile.position.z) * tileSize * gridSize;
        }
    });
};

const createTrack = () => {
    const trackPoints = [
        new THREE.Vector3(-100, 1, -100),
        new THREE.Vector3(0, 1, -150),
        new THREE.Vector3(100, 1, -100),
        new THREE.Vector3(150, 1, 0),
        new THREE.Vector3(100, 1, 100),
        new THREE.Vector3(0, 1, 150),
        new THREE.Vector3(-100, 1, 100),
        new THREE.Vector3(-150, 1, 0),
        new THREE.Vector3(-100, 1, -100)
    ];

    const trackCurve = new THREE.CatmullRomCurve3(trackPoints, true); // Loop the path

    const trackGeometry = new THREE.TubeGeometry(trackCurve, 300, 5, 20, true);
    const trackMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333, // Asphalt color
        flatShading: true,
    });

    const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
    trackMesh.receiveShadow = true;

    return trackMesh;
};

const scatterProps = (scene) => {
    const propMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Rock color

    for (let i = 0; i < 50; i++) {
        const rock = new THREE.Mesh(new THREE.SphereGeometry(Math.random() * 2, 16, 16), propMaterial);
        rock.position.set(
            Math.random() * 500 - 250,
            1,
            Math.random() * 500 - 250
        );
        rock.castShadow = true;
        scene.add(rock);
    }

    // Add cacti or foliage
    const cactusMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Green
    for (let i = 0; i < 20; i++) {
        const cactus = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 8, 8), cactusMaterial);
        cactus.position.set(
            Math.random() * 500 - 250,
            4,
            Math.random() * 500 - 250
        );
        cactus.castShadow = true;
        scene.add(cactus);
    }
};

const createDustEffect = () => {
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xD3D3D3,
        size: 0.5,
        transparent: true,
        opacity: 0.5,
    });

    return new THREE.Points(particles, particleMaterial);
};


const applyTractionControl = (vehicle) => {
    const speed = vehicle.chassisBody.velocity.length();
    const friction = Math.max(0.5, 1 - speed / 50);

    vehicle.wheelBodies.forEach((wheel) => {
        wheel.material.friction = friction;
    });
};

const buildPlane = () => {
    const geometry = new THREE.PlaneGeometry(tileSize, tileSize, 50, 50);
    const material = new THREE.MeshStandardMaterial({ color: 0xdeb887, flatShading: true });

    const noise2D = createNoise2D();
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 2] = noise2D(vertices[i] / 20, vertices[i + 1] / 20) * 5;
    }

    geometry.computeVertexNormals();
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    return plane;
};

const loadCarModel = async () => {
    const loader = new GLTFLoader();
    const car = await loader.loadAsync('../Models/mazda_rx7_stylised.glb');
    car.scene.scale.set(0.01, 0.01, 0.01);
    car.scene.position.set(0, 0.2, 0);

    car.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
        }
    });

    return car.scene;
};

const addLighting = (scene) => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Stronger light
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Brighter ambient light
    scene.add(ambientLight);
};

const create3DEnvironment = async () => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    
    loadTrackModel()
    .then((track) => {
        scene.add(track);  // Add the track to the scene

        track.traverse((child) => {
            console.log('Child:', child.name);  // Log all object names
        });
        
        // Adjust the camera to fit the track
        const bbox = new THREE.Box3().setFromObject(track);
        const center = bbox.getCenter(new THREE.Vector3());
        track.position.set(-200, 0, 1100);
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Adjust the camera position based on the size of the track
        camera.position.set(center.x, center.y + maxDim * 1.5, center.z + maxDim * 2);
        camera.lookAt(center);
    })
    .catch((error) => console.error(error));
    
    ///createTerrainTiles(scene);
    //scene.add(createTrack());
    //scatterProps(scene)
    const car = await loadCarModel();
    scene.add(car);
    addLighting(scene);

    const finishLineArch = createFinishLineArch();
    finishLineArch.position.set(0, 0, 150);
    scene.add(finishLineArch);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const animate = () => {
        requestAnimationFrame(animate);
        physicsWorld.fixedStep(1 / 60);
        car.position.copy(vehicle.chassisBody.position);
        car.quaternion.copy(vehicle.chassisBody.quaternion);
        applyTractionControl(vehicle);
        updateTerrainTiles(car.position);
        updateCamera(camera, vehicle, terrainTiles[0]);
        renderer.render(scene, camera);
    };

    animate();
};

create3DEnvironment();