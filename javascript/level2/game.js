// class Game {
//     constructor(time, vehicle) {
//         this.time = time;
//         this.vehicle = vehicle;
//         this.state = "start";
//         this.count = 3;
//         this.countdownInterval = null;
//         this.timerInterval = null;
//         this.maxSteerVal = Math.PI / 8;
//         this.maxForce = 15;
//         this.frictionCoefficient = 0.05;
//     }


//     stopTime() {
//         if (this.time === 0 && this.state === "running") {
//             clearInterval(this.timerInterval);
//             this.state = "stopped";
//             window.location.href = 'lostScreen2.html';
//         }
//         else if(this.time != 0 && this.state === "stopped"){
//             clearInterval(this.countdownInterval);
//             window.location.href = '../../html/winScreen2.html';
//         }
//     }
    

//     runTime() {
//         this.state = "running";
//         this.timerInterval = setInterval(() => {
//             this.time -= 1;
//             document.getElementById('stopwatch').innerText = this.time;
//             this.stopTime();
//         }, 1000);
//     }


//     startTime() {
//         this.countdownInterval = setInterval(() => {
//             this.count -= 1;
//             console.log(this.count);
//             document.getElementById('countdown').innerText = this.count;

//             if (this.count === 0) {
//                 clearInterval(this.countdownInterval);
//                 document.getElementById('countdown').innerText = '';
//                 this.runTime();
//             }
//         }, 1000);
//     }


//     enableInputControls(){
//         window.addEventListener('keydown', (event) => {
//             switch (event.key) {
//                 case 'ArrowUp':
//                 case 'w':
//                     this.vehicle.setWheelForce(this.maxForce, 0);
//                     this.vehicle.setWheelForce(this.maxForce, 1);
//                     break;
//                 case 'ArrowDown':
//                 case 's':
//                     this.vehicle.setWheelForce(-this.maxForce / 2, 0);
//                     this.vehicle.setWheelForce(-this.maxForce / 2, 1);
//                     break;
//                 case 'ArrowLeft':
//                 case 'a':
//                     this.vehicle.setSteeringValue(this.maxSteerVal, 0);
//                     this.vehicle.setSteeringValue(this.maxSteerVal, 1);
//                     break;
//                 case 'ArrowRight':
//                 case 'd':
//                     this.vehicle.setSteeringValue(-this.maxSteerVal, 0);
//                     this.vehicle.setSteeringValue(-this.maxSteerVal, 1);
//                     break;
//             }
//         });
        
//         window.addEventListener('keyup', (event) => {
//             switch (event.key) {
//                 case 'w':
//                 case 'ArrowUp':
//                     this.vehicle.setWheelForce(0, 0);
//                     this.vehicle.setWheelForce(0, 1);
//                     break;
//                 case 's':
//                 case 'ArrowDown':
//                     this.vehicle.setWheelForce(0, 0);
//                     this.vehicle.setWheelForce(0, 1);
//                     break;
//                 case 'a':
//                 case 'ArrowLeft':
//                     this.vehicle.setSteeringValue(0, 0);
//                     this.vehicle.setSteeringValue(0, 1);
//                     break;
//                 case 'd':
//                 case 'ArrowRight':
//                     this.vehicle.setSteeringValue(0, 0);
//                     this.vehicle.setSteeringValue(0, 1);
//                     break;
//             }
//         });
//     };


//     disableInputControls(){
//         window.addEventListener('keydown', (event) => {
//             switch (event.key) {
//                 case 'ArrowUp':
//                 case 'w':
//                     this.vehicle.setWheelForce(0, 0);
//                     this.vehicle.setWheelForce(0, 1);
//                     break;
//                 case 'ArrowDown':
//                 case 's':
//                     this.vehicle.setWheelForce(0, 0);
//                     this.vehicle.setWheelForce(0, 1);
//                     break;
//                 case 'ArrowLeft':
//                 case 'a':
//                     this.vehicle.setSteeringValue(0, 0);
//                     this.vehicle.setSteeringValue(0, 1);
//                     break;
//                 case 'ArrowRight':
//                 case 'd':
//                     this.vehicle.setSteeringValue(0, 0);
//                     this.vehicle.setSteeringValue(0, 1);
//                     break;
//             }
//         });
        
//         window.addEventListener('keyup', (event) => {
//             switch (event.key) {
//                 case 'w':
//                 case 'ArrowUp':
//                     this.vehicle.setWheelForce(0, 0);
//                     this.vehicle.setWheelForce(0, 1);
//                     break;
//                 case 's':
//                 case 'ArrowDown':
//                     this.vehicle.setWheelForce(0, 0);
//                     this.vehicle.setWheelForce(0, 1);
//                     break;
//                 case 'a':
//                 case 'ArrowLeft':
//                     this.vehicle.setSteeringValue(0, 0);
//                     this.vehicle.setSteeringValue(0, 1);
//                     break;
//                 case 'd':
//                 case 'ArrowRight':
//                     this.vehicle.setSteeringValue(0, 0);
//                     this.vehicle.setSteeringValue(0, 1);
//                     break;
//             }
//         });
//     };


//     checkState(){
//         if (this.state === "running") {
//             this.enableInputControls();
//             if (!window.keyIsPressed) {
//                 const velocity = this.vehicle.chassisBody.velocity;
//                 velocity.x *= (1 - this.frictionCoefficient);
//                 velocity.z *= (1 - this.frictionCoefficient);
//             }
//         } else {
//             this.disableInputControls();
//         }
//     }
// }

// export { Game };

import * as THREE from 'three';

class Game {
    constructor(time, vehicle) {
        this.time = time;
        this.vehicle = vehicle;
        this.state = "start";
        this.count = 3;
        this.countdownInterval = null;
        this.timerInterval = null;
        this.maxSteerVal = Math.PI / 8;
        this.maxForce = 15;
        this.frictionCoefficient = 0.05;

        // Sound properties
        this.accelSound = null;
        this.listener = new THREE.AudioListener();
        // camera.add(this.listener); // Assuming 'camera' is available globally or passed in constructor
        this.loadSound();
    }

    loadSound() {
        const audioLoader = new THREE.AudioLoader();
        this.accelSound = new THREE.Audio(this.listener);

        audioLoader.load('../../sounds/engine_start.mp3', (buffer) => {
            this.accelSound.setBuffer(buffer);
            this.accelSound.setLoop(true);
            this.accelSound.setVolume(0.5);
        });
    }

    playSound() {
        if (!this.accelSound.isPlaying) {
            this.accelSound.play();
        }
    }

    stopSound() {
        if (this.accelSound.isPlaying) {
            this.accelSound.stop();
        }
    }

    stopTime() {
        if (this.time === 0 && this.state === "running") {
            clearInterval(this.timerInterval);
            this.state = "stopped";
            window.location.href = 'lostScreen2.html';
        } else if (this.time !== 0 && this.state === "stopped") {
            clearInterval(this.countdownInterval);
            window.location.href = '../../html/winScreen2.html';
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
            document.getElementById('countdown').innerText = this.count;

            if (this.count === 0) {
                clearInterval(this.countdownInterval);
                document.getElementById('countdown').innerText = '';
                this.runTime();
            }
        }, 1000);
    }

    toggleInputControls(enable) {
        if (enable) {
            window.addEventListener('keydown', this.handleKeydown.bind(this));
            window.addEventListener('keyup', this.handleKeyup.bind(this));
        } else {
            window.removeEventListener('keydown', this.handleKeydown.bind(this));
            window.removeEventListener('keyup', this.handleKeyup.bind(this));
        }
    }

    handleKeydown(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                this.vehicle.setWheelForce(this.maxForce, 0);
                this.vehicle.setWheelForce(this.maxForce, 1);
                this.playSound(); // Play sound on acceleration
                break;
            case 'ArrowDown':
            case 's':
                this.vehicle.setWheelForce(-this.maxForce / 2, 0);
                this.vehicle.setWheelForce(-this.maxForce / 2, 1);
                break;
            case 'ArrowLeft':
            case 'a':
                this.vehicle.setSteeringValue(this.maxSteerVal, 0);
                this.vehicle.setSteeringValue(this.maxSteerVal, 1);
                break;
            case 'ArrowRight':
            case 'd':
                this.vehicle.setSteeringValue(-this.maxSteerVal, 0);
                this.vehicle.setSteeringValue(-this.maxSteerVal, 1);
                break;
        }
    }

    handleKeyup(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'ArrowDown':
            case 's':
                this.vehicle.setWheelForce(0, 0);
                this.vehicle.setWheelForce(0, 1);
                this.stopSound(); // Stop sound when releasing the key
                break;
            case 'ArrowLeft':
            case 'a':
            case 'ArrowRight':
            case 'd':
                this.vehicle.setSteeringValue(0, 0);
                this.vehicle.setSteeringValue(0, 1);
                break;
        }
    }

    checkState() {
        if (this.state === "running") {
            this.toggleInputControls(true);
            if (!window.keyIsPressed) {
                const velocity = this.vehicle.chassisBody.velocity;
                velocity.x *= (1 - this.frictionCoefficient);
                velocity.z *= (1 - this.frictionCoefficient);
            }
        } else {
            this.toggleInputControls(false);
        }
    }
}

export { Game };
