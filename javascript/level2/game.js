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
    }


    stopTime() {
        if (this.time === 0 && this.state === "running") {
            clearInterval(this.timerInterval);
            this.state = "stopped";
            window.location.href = 'lostScreen1.html';
        }
        else if(this.time != 0 && this.state === "stopped"){
            clearInterval(this.countdownInterval);
            window.location.href = '../html/winScreen2.html';
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


    enableInputControls(){
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    this.vehicle.setWheelForce(this.maxForce, 0);
                    this.vehicle.setWheelForce(this.maxForce, 1);
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
        });
        
        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    this.vehicle.setWheelForce(0, 0);
                    this.vehicle.setWheelForce(0, 1);
                    break;
                case 's':
                case 'ArrowDown':
                    this.vehicle.setWheelForce(0, 0);
                    this.vehicle.setWheelForce(0, 1);
                    break;
                case 'a':
                case 'ArrowLeft':
                    this.vehicle.setSteeringValue(0, 0);
                    this.vehicle.setSteeringValue(0, 1);
                    break;
                case 'd':
                case 'ArrowRight':
                    this.vehicle.setSteeringValue(0, 0);
                    this.vehicle.setSteeringValue(0, 1);
                    break;
            }
        });
    };


    disableInputControls(){
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    this.vehicle.setWheelForce(0, 0);
                    this.vehicle.setWheelForce(0, 1);
                    break;
                case 'ArrowDown':
                case 's':
                    this.vehicle.setWheelForce(0, 0);
                    this.vehicle.setWheelForce(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                    this.vehicle.setSteeringValue(0, 0);
                    this.vehicle.setSteeringValue(0, 1);
                    break;
                case 'ArrowRight':
                case 'd':
                    this.vehicle.setSteeringValue(0, 0);
                    this.vehicle.setSteeringValue(0, 1);
                    break;
            }
        });
        
        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    this.vehicle.setWheelForce(0, 0);
                    this.vehicle.setWheelForce(0, 1);
                    break;
                case 's':
                case 'ArrowDown':
                    this.vehicle.setWheelForce(0, 0);
                    this.vehicle.setWheelForce(0, 1);
                    break;
                case 'a':
                case 'ArrowLeft':
                    this.vehicle.setSteeringValue(0, 0);
                    this.vehicle.setSteeringValue(0, 1);
                    break;
                case 'd':
                case 'ArrowRight':
                    this.vehicle.setSteeringValue(0, 0);
                    this.vehicle.setSteeringValue(0, 1);
                    break;
            }
        });
    };


    checkState(){
        if (this.state === "running") {
            this.enableInputControls();
            if (!window.keyIsPressed) {
                const velocity = this.vehicle.chassisBody.velocity;
                velocity.x *= (1 - this.frictionCoefficient);
                velocity.z *= (1 - this.frictionCoefficient);
            }
        } else {
            this.disableInputControls();
        }
    }
}

export { Game };