import * as THREE from "three";
import { Car, E_Car } from "./car"
import { FuelCan } from "./fuelcan";
import { renderMap } from "./renderMap2";
import { FlyControls } from "./Flycontrols";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stand from "./stand";
import { FLine } from "./finishline";

const scene = new THREE.Scene();

window['scene'] = scene;

///////////////////////////////////////////////// TRACK /////////////////////////////////////////////
const trackRadius = 400;
const trackWidth = 90;
const trackLength = 800;
const barrierWidth = 60
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

var insetWidth, insetHeight;


const arcAngle1 = (1 / 3) * Math.PI; // 60 degrees

const deltaY = Math.sin(arcAngle1) * innerTrackRadius

const arcCEnterX =                                  // Center postion of the arcs
	(
		// Math.cos(arcAngle1) * innerTrackRadius + Math.cos(arcAngle2) * outerTrackRadius
		trackLength
	) / 2;


///////////////////////////////////////////// Car ////////////////////////////////////////////////////
const playerCar = Car();
// Postion of Car
playerCar.position.x = -arcCEnterX;
playerCar.position.y = trackRadius - 40;
playerCar.position.z = 10;

scene.add(playerCar);

const enemyCar1 = E_Car();

enemyCar1.position.x = -arcCEnterX;
enemyCar1.position.y = trackRadius + 40;
enemyCar1.position.z = 10;

scene.add(enemyCar1)

const enemyCar2 = E_Car();

enemyCar2.position.x = -arcCEnterX + 110;
enemyCar2.position.y = trackRadius - 40;
enemyCar2.position.z = 10;

scene.add(enemyCar2)


const enemyCar3 = E_Car();

enemyCar3.position.x = -arcCEnterX + 110;
enemyCar3.position.y = trackRadius + 40;
enemyCar3.position.z = 10;

scene.add(enemyCar3)

let enemyvehicles = []
enemyvehicles.push(enemyCar1)
enemyvehicles.push(enemyCar2)
enemyvehicles.push(enemyCar3)

///////////////////////////////////////////// Stand //////////////////////////////////////////////////

const stand1 = Stand()

stand1.position.x = 0;
stand1.position.y = outerTrackRadius + barrierWidth + trackWidth + 50;
stand1.rotateZ(Math.PI / 2)

scene.add(stand1)

const stand2 = Stand()

stand2.position.x = 0;
stand2.position.y = -(outerTrackRadius + barrierWidth + trackWidth + 50);
stand2.rotateZ(Math.PI / 2)

scene.add(stand2)

const stand3 = Stand()

stand3.position.x = -(trackLength / 2 + outerTrackRadius + barrierWidth + trackWidth + 50);
stand3.position.y = 0;

scene.add(stand3)

const stand4 = Stand()

stand4.position.x = (trackLength / 2 + outerTrackRadius + barrierWidth + trackWidth + 50);
stand4.position.y = 0;

scene.add(stand4)

/////////////////////////// Pick Random ////////////////////////////////


function pickRandom(array) {
	return array[Math.floor(Math.random() * array.length)];
}

let fc_xcords = [-arcCEnterX, arcCEnterX, 0, -arcCEnterX - (trackWidth / 2), arcCEnterX + (trackWidth / 2)]
let fc_ycords = [trackRadius, -trackRadius, trackRadius - 60, trackRadius + 60, -trackRadius - 60, -trackRadius + 60]
///////////////////////////////////// FUEL CANS ////////////////////////
let fuelcans = []

for (let i = 0; i < 10; i++) {
	let fc = FuelCan()
	fc.position.x = pickRandom(fc_xcords)
	fc.position.y = pickRandom(fc_ycords)
	fc.position.z = 20
	fc.rotateY(Math.PI / 2)
	scene.add(fc)
	fuelcans.push(fc)
}


////////////////////////////////////// FINISH LINE ////////////////////////////////////
const fline = FLine()
fline.position.x = 0
fline.position.y = trackRadius
fline.position.z = -10
fline.rotateZ(Math.PI / 2)
scene.add(fline)


// Position of Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
dirLight.position.set(100, -300, 400);        // This postion is the direction vector of the light
scene.add(dirLight)

/////////////////////////////////////////// Camera //////////////////////////////////////////////////
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 3500;
const cameraHeight = cameraWidth / aspectRatio;


// Perspective Camera code :        // for dashboatrd view
const P_camera = new THREE.PerspectiveCamera(
	45,         // vertical field of view
	aspectRatio,        // aspect ratio
	0.1,         // near plane
	30000,        // far plane
);


const front_camera = new THREE.PerspectiveCamera(
	45,         // vertical field of view
	aspectRatio,        // aspect ratio
	0.1,         // near plane
	30000,        // far plane
);

const min_camera = new THREE.OrthographicCamera(
	cameraWidth / -2,           // left
	cameraWidth / 2,            // right
	cameraHeight / 2,           // top
	cameraHeight / -2,          // bottom
	0,              // near plane
	30000            // farplane 

);



// cameraHeight.up.set(0,0,1);


min_camera.position.set(0, 0, 200);
min_camera.up.set(0, 0, 1)
min_camera.rotateX(Math.PI)


// cameraHeight.up.set(0,0,1);
min_camera.lookAt(0, 0, 0);


P_camera.position.set(playerCar.position.x - 200, playerCar.position.y, playerCar.position.z + 100)
P_camera.lookAt(playerCar.position.x, playerCar.position.y, playerCar.position.z)

// console.log(playerCar.position.x,playerCar.position.y,playerCar.position.z)
P_camera.up.set(0, 0, 1)

P_camera.updateProjectionMatrix()

front_camera.position.set(playerCar.position.x + 100, playerCar.position.y, playerCar.position.z + 15)
front_camera.lookAt(playerCar.position.x + 150, playerCar.position.y, playerCar.position.z + 15)
front_camera.up.set(0, 0, 1)

renderMap(cameraWidth * 4, cameraHeight * 4);              // Horizontally, track fills image, but height has to be bigger than camera height to imporve field of view, else we'd see edges of the map


/*Set up Renderer*/
const Renderer = new THREE.WebGLRenderer({ antialias: true });
Renderer.setSize(window.innerWidth, window.innerHeight);
// Instead repeated every animate cycle
document.body.appendChild(Renderer.domElement);     // Add renderer to display image.

// const controls = new OrbitControls(P_camera, Renderer.domElement);

////////////////////// GAME FUNCTIONS 	///////////////////////////

window.focus(); // Capture keys right away (by default focus is on editor)
let ready = false;			// if set, then game start, if not , then menu
let start = false;

let score;
const speed = 0.2
// const scoreElement = document.getElementById("score");
let lastTimestamp;

let accelerate = false;
let decelerate = false;
let left = false;
let right = false;

let camera_mode = false

// let totalPlayerAngle = 0;
// let PlayerAngleMoved[i] = 0;

let totalPlayerAngle = [0, 0, 0]

const Player_Object = new Object();
Player_Object.health = 100;
Player_Object.fuel = 100;
Player_Object.score = 0;
Player_Object.time = 0;
Player_Object.position = 0;
Player_Object.distance = 0;
Player_Object.mileage = 60

const Enemy_Objects = []

for (let i = 0; i < 3; i++) {
	let Enemy_obj = new Object()
	Enemy_obj.health = 100;
	Enemy_obj.fuel = 40;
	Enemy_obj.score = 0;
	Enemy_obj.time = 0;
	Enemy_obj.distance = 0;
	Enemy_obj.position = 0;
	Enemy_Objects.push(Enemy_obj)
}

reset()

function reset() {
	//Reset position and scores

	movePlayerCar(0)
	score = 0;
	// scoreElement.innerText = score;
	lastTimestamp = undefined;

	Renderer.render(scene, P_camera)

	ready = true;
	startGame();
}

function startGame() {
	if (ready) {
		ready = false;

		Renderer.setAnimationLoop(animation);
	}
}

//////////////////////////// PROCESS INPUTS //////////////////////
window.addEventListener("keydown", (event) => {
	// console.log("HERE")

	if (event.key == "ArrowUp") {
		accelerate = true;
		decelerate = false;
		start = true;
	}

	if (event.key == "ArrowDown") {
		decelerate = true;
		accelerate = false;				// Will take recent input as correct
	}

	if (event.key == "ArrowLeft") {
		left = true;
		right = false
	}

	if (event.key == "ArrowRight") {
		left = false;
		right = true;
	}

	if (event.key == "W" || event.key == "w") {
		const keys_div = document.getElementById("Keys")
		keys_div.remove()
	}

	if (event.key == "C" || event.key == "c") {
		camera_mode = !camera_mode
	}

	return;
})

window.addEventListener('click', () => {
	document.getElementById("Keys").remove()
	start = true;
})

window.addEventListener("keyup", (event) => {
	if (event.key == "ArrowUp") {
		accelerate = false;
	}

	if (event.key == "ArrowDown") {
		decelerate = false;
	}

	if (event.key == "ArrowLeft") {
		left = false;
	}

	if (event.key == "ArrowRight") {
		right = false;
	}

	return;
})

window.addEventListener("resize", () => {
	console.log("resize", window.innerWidth, window.innerHeight);

	// Adjust camera
	const newAspectRatio = window.innerWidth / window.innerHeight;
	const adjustedCameraHeight = cameraWidth / newAspectRatio;

	P_camera.top = adjustedCameraHeight / 2;
	P_camera.bottom = adjustedCameraHeight / -2;
	P_camera.updateProjectionMatrix(); // Must be called after change

	// positionScoreElement();

	// Reset renderer
	Renderer.setSize(window.innerWidth, window.innerHeight);

	insetWidth = window.innerWidth / 5;
	insetHeight = window.innerHeight / 5;

	min_camera.aspect = insetWidth / insetHeight;
	min_camera.updateProjectionMatrix()
});




////////////////////////// MOVE CAR //////////////////////////

function getPlayerSpeed(value) {

	if (value) {
		if (accelerate) return speed * 2.5;
		if (decelerate) return -speed;

		return 0;
	}
	else {
		return speed;
	}
}

function movePlayerCar(timeDelta) {
	const playerSpeed = getPlayerSpeed(true);


	if (left) {
		playerCar.rotation.z += 0.015
	}

	if (right) {
		playerCar.rotation.z -= 0.015
	}

	playerCar.position.x += Math.cos(playerCar.rotation.z) * playerSpeed * timeDelta
	playerCar.position.y += Math.sin(playerCar.rotation.z) * playerSpeed * timeDelta

	Player_Object.time += timeDelta;
	Player_Object.distance += playerSpeed * timeDelta;

	if (playerSpeed !== 0) {
		Player_Object.fuel -= (playerSpeed * timeDelta) / Player_Object.mileage;
	}

	// console.log(playerCar.rotation



	P_camera.position.set(playerCar.position.x - Math.cos(playerCar.rotation.z) * 200, playerCar.position.y - Math.sin(playerCar.rotation.z) * 200, playerCar.position.z + 50)
	// console.log(playerCar.position)
	P_camera.lookAt(playerCar.position.x, playerCar.position.y, playerCar.position.z)

	front_camera.position.set(playerCar.position.x + Math.cos(playerCar.rotation.z) * 100, playerCar.position.y + Math.sin(playerCar.rotation.z)*100, playerCar.position.z + 15)

	front_camera.lookAt(playerCar.position.x + Math.cos(playerCar.rotation.z) *150, playerCar.position.y + Math.sin(playerCar.rotation.z)* 150, playerCar.position.z + 15)

}

function moveOtherVehicles(timeDelta) {
	enemyvehicles.forEach((vehicle, i) => {

		const playerSpeed = getPlayerSpeed(false);
		if (vehicle.position.y > 0) {
			if (vehicle.position.x < -arcCEnterX || vehicle.position.x > arcCEnterX) {
				vehicle.rotation.z -= Math.asin(playerSpeed * timeDelta / trackRadius)

				totalPlayerAngle[i] = vehicle.rotation.z;

				// console.log(totalPlayerAngle[i])

				const playerX = Math.cos(totalPlayerAngle[i]) * playerSpeed * timeDelta;
				const playerY = Math.sin(totalPlayerAngle[i]) * playerSpeed * timeDelta;

				vehicle.position.x += playerX;
				vehicle.position.y += playerY;

			}
			else {

				vehicle.position.x += Math.cos(vehicle.rotation.z) * playerSpeed * timeDelta * 2
				vehicle.position.y += Math.sin(vehicle.rotation.z) * playerSpeed * timeDelta * 2

			}
		}
		else if (vehicle.position.y < 0) {
			if (vehicle.position.x < -arcCEnterX || vehicle.position.x > arcCEnterX) {
				vehicle.rotation.z -= Math.asin(playerSpeed * timeDelta / trackRadius)

				totalPlayerAngle[i] = vehicle.rotation.z;

				// console.log(totalPlayerAngle[i])

				const playerX = Math.cos(totalPlayerAngle[i]) * playerSpeed * timeDelta;
				const playerY = Math.sin(totalPlayerAngle[i]) * playerSpeed * timeDelta;

				vehicle.position.x += playerX;
				vehicle.position.y += playerY;

			}
			else {
				if (i === 0) {
					vehicle.position.x += Math.cos(vehicle.rotation.z) * playerSpeed * timeDelta * 0.5
					vehicle.position.y += Math.sin(vehicle.rotation.z) * playerSpeed * timeDelta * 0.5

				}
				else {
					vehicle.position.x += Math.cos(vehicle.rotation.z) * playerSpeed * timeDelta * 2
					vehicle.position.y += Math.sin(vehicle.rotation.z) * playerSpeed * timeDelta * 2
				}
			}

		}
		else {
			if (vehicle.position.x < -arcCEnterX) {
				vehicle.position.x += Math.cos(vehicle.rotation.z) * playerSpeed * timeDelta
				vehicle.position.y += Math.sin(vehicle.rotation.z) * playerSpeed * timeDelta

			}
			else if (vehicle.position.x > arcCEnterX) {
				vehicle.position.x += Math.cos(vehicle.rotation.z) * playerSpeed * timeDelta
				vehicle.position.y += Math.sin(vehicle.rotation.z) * playerSpeed * timeDelta

			}

		}
	})
}

/////////////////////////// COLLISIONS ////////////////////////

function hitDetection() {
	const carBox = new THREE.Box3().setFromObject(playerCar);
	////////////////// BARRIERS ////////////////////////////////		/*Reduce Health if hit */

	///////////////////// Striaght Path Point wise checking /////////////////////////////////////
	for (let x = -arcCEnterX; x <= arcCEnterX; x++) {
		for (let y = innerTrackRadius - 40; y < innerTrackRadius - 10; y++) {
			if (carBox.containsPoint(new THREE.Vector3(x, y, 15))) {
				console.log("HIT HIT HIT 1")
				accelerate = false;
				decelerate = false;
				Player_Object.health -= 0.05;

			}

		}

		for (let y = outerTrackRadius + 20; y < outerTrackRadius + 60; y++) {
			if (carBox.containsPoint(new THREE.Vector3(x, y, 15))) {
				console.log("HIT HIT HIT 2")
				accelerate = false;
				decelerate = false;
				Player_Object.health -= 0.05;

			}
		}

		for (let y = -innerTrackRadius + 10; y < -innerTrackRadius + 40; y++) {
			if (carBox.containsPoint(new THREE.Vector3(x, y, 15))) {
				console.log("HIT HIT HIT 3")
				accelerate = false;
				decelerate = false;
				Player_Object.health -= 0.05;

			}
		}

		for (let y = -outerTrackRadius - 40; y < -outerTrackRadius - 10; y++) {
			if (carBox.containsPoint(new THREE.Vector3(x, y, 15))) {
				console.log("HIT HIT HIT 4")
				accelerate = false;
				decelerate = false;
				Player_Object.health -= 0.05;

			}
		}
	}

	/////////////////// Curve Paths /////////////////////////////////////////////////

	for (let theta = 0; theta < Math.PI; theta += 0.5) {

		//////// RIGHT CURVE ////////////////////////////
		for (let r = innerTrackRadius - 40; r < innerTrackRadius - 10; r++) {
			if (carBox.containsPoint(new THREE.Vector3(arcCEnterX + r * Math.sin(theta), r * Math.cos(theta), 15))) {
				console.log("HIT HIT HIT 5")
				accelerate = false;
				decelerate = false;
				Player_Object.health -= 0.05;

			}
		}

		for (let r = outerTrackRadius + 20; r < outerTrackRadius + 60; r++) {
			if (carBox.containsPoint(new THREE.Vector3(arcCEnterX + r * Math.sin(theta), r * Math.cos(theta), 15))) {
				console.log("HIT HIT HIT 6")
				accelerate = false;
				decelerate = false;
				Player_Object.health -= 0.05;

			}
		}
		////////////////////////// LEFT CURVE ////////////////////

		for (let r = -innerTrackRadius + 10; r < -innerTrackRadius + 40; r++) {
			if (carBox.containsPoint(new THREE.Vector3(-arcCEnterX + r * Math.sin(theta), r * Math.cos(theta), 15))) {
				console.log("HIT HIT HIT 7")
				accelerate = false;
				decelerate = false;
				Player_Object.health -= 0.05;

			}
		}

		for (let r = -outerTrackRadius - 40; r < -outerTrackRadius - 10; r++) {
			if (carBox.containsPoint(new THREE.Vector3(-arcCEnterX + r * Math.sin(theta), r * Math.cos(theta), 15))) {
				console.log("HIT HIT HIT 8")
				accelerate = false;
				decelerate = false;
				Player_Object.health -= 0.05;

			}
		}
	}

	////////////////// Vehicles  ///////////////////////////////		/*Reduce HEalth if hit */

	enemyvehicles.forEach((vehicle, i) => {
		let vehicleBox = new THREE.Box3().setFromObject(vehicle);
		if (carBox.intersectsBox(vehicleBox)) {
			accelerate = false;
			decelerate = false;
			Player_Object.health -= 5;
			Enemy_Objects[i].health -= 10;
			//  Reduce health when hit
		}
	})


	////////////////// Fuel Cans ///////////////////////////////		/*Increase Fuel if hit, remove Fuel can*/
	for (let i = 0; i < fuelcans.length; i++) {
		if (carBox.containsPoint(fuelcans[i].position)) {
			//////////////// Fuel Can Hit
			scene.remove(fuelcans[i])
			fuelcans.splice(i, 1);
			Player_Object.fuel += 30;			//		Fuel can is 20 
		}
	}
}



/////////////////////////// CHECKING IF HEALTH / FUEL IS ZERO 	//////////////////////////////////

function healthcheck() {
	if (Player_Object.health <= 0) {
		// alert("GAME OVER , PLAYER HEALTH IS ZERO")
		Renderer.setAnimationLoop(null)
		const gameoverBox = document.getElementById("gameover");
        
        // Show the game over box
        gameoverBox.style.display = 'flex';
	}
}

function fuelcheck() {
	if (Player_Object.fuel <= 0) {
		// alert("GAME OVER , FUEL IS ZERO")
		
		Renderer.setAnimationLoop(null)
		const gameoverBox = document.getElementById("gameoverFuel");
        
        // Show the game over box
        gameoverBox.style.display = 'flex';
	}
}


//////////////////////////// UPDATE SCORE ///////////////////////////////////////

function updatevalues() {
	const scoredic = document.getElementById("score")
	scoredic.innerText = "Score: " + Player_Object.distance.toFixed(2)
	const health = document.getElementById("health")
	health.innerText = "Health: " + Player_Object.health
	const time1 = document.getElementById("time")
	time1.innerText = "Time: " + Player_Object.time.toFixed(2)
	const fuel = document.getElementById("fuel")
	fuel.innerText = "Fuel: " + Player_Object.fuel.toFixed(2)
	const mileage = document.getElementById("mileage")
	mileage.innerText = "Mileage: " + Player_Object.mileage.toFixed(2)

	////////////////////////////// GET Nearest Can //////////////////////////////
	let min = 100000000;
	let a = new THREE.Vector3(playerCar.position.x, playerCar.position.y, playerCar.position.z);
	for (let i = 0; i < fuelcans.length; i++) {
		if (a.distanceTo(fuelcans[i].position) < min) {
			min = a.distanceTo(fuelcans[i].position)
		}
	}

	const closest = document.getElementById("closest")
	closest.innerText = "Next-can : " + min.toFixed(2)
}


////////////////////////// WIN CONDITON //////////////////////
let laps = 2

let p_laps = 0

let e_laps = [0, 0, 0]

let position = 1;

function winconditioncheck() {
	if (playerCar.position.x >= 0 && playerCar.position.x <= 2 && playerCar.position.y > 0) {
		p_laps++;
		if (p_laps === laps) {
			//////////// WIN CONDITION ///////////////////////
			const standings = document.getElementById("standings")
			standings.innerText = "GAME OVER\nYour Position was " + position + " Out of 4 !";
			Renderer.setAnimationLoop(null);
		}

	}

	enemyvehicles.forEach((vehicle, i) => {

		if (vehicle.position.x >= 0 && vehicle.position.x <= 2 && vehicle.position.y > 0) {
			e_laps[i]++;
			if (e_laps[i] === laps) {
				position++;
			}
		}
	})
}

////////////////////////// ANIMATION /////////////////////////
// controls.update()

function animation(timestamp) {
	if (!lastTimestamp) {
		lastTimestamp = timestamp;
		return;
	}

	const timeDelta = timestamp - lastTimestamp;

	if (start) {
		movePlayerCar(timeDelta);
		// controls.update()

		// Update score if it changed
		// if (laps != score) {
		// 	score = laps;
		// 	scoreElement.innerText = score;
		// }
		updatevalues();

		moveOtherVehicles(timeDelta);

		hitDetection();

		fuelcheck();

		healthcheck();

		winconditioncheck();


	}
	// Set viewport parameters;

	console.log("Plaps", p_laps)


	insetWidth = window.innerWidth / 5;
	insetHeight = window.innerHeight / 5;

	min_camera.aspect = insetWidth / insetHeight;
	min_camera.updateProjectionMatrix()

	// P_camera.updateProjectionMatrix()


	if (!camera_mode) {
		Renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		Renderer.render(scene, P_camera);
		Renderer.clearDepth()
	}
	else {
		Renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		Renderer.render(scene, front_camera);
		Renderer.clearDepth()
	}


	Renderer.setScissorTest(true);

	Renderer.setScissor(
		window.innerWidth - insetWidth - 16,
		window.innerHeight - insetHeight - 16,
		insetWidth,
		insetHeight);

	Renderer.setViewport(
		window.innerWidth - insetWidth - 16,
		window.innerHeight - insetHeight - 16,
		insetWidth,
		insetHeight
	)
	Renderer.render(scene, min_camera);

	Renderer.setScissorTest(false);
	lastTimestamp = timestamp;
}

