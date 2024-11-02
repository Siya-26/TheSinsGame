// controls.js
import * as CANNON from 'cannon-es';

class Controls {
    constructor(vehicle) {
        this.vehicle = vehicle;
        this.maxSteerVal = Math.PI / 8;
        this.maxForce = 10;
        this.brakeForce = -5; // Set a force value for braking
        this.frictionCoefficient = 0.02;

        // Bind the event handlers to maintain the correct 'this' context
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    // Event handler for keydown events
    onKeyDown(event) {
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
            case ' ': // Spacebar for braking
                this.vehicle.setWheelForce(this.brakeForce, 0);
                this.vehicle.setWheelForce(this.brakeForce, 1);
                break;
        }
    }

    // Event handler for keyup events
    onKeyUp(event) {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
            case 's':
            case 'ArrowDown':
            case ' ':
                this.vehicle.setWheelForce(0, 0);
                this.vehicle.setWheelForce(0, 1);
                break;
            case 'a':
            case 'ArrowLeft':
            case 'd':
            case 'ArrowRight':
                this.vehicle.setSteeringValue(0, 0);
                this.vehicle.setSteeringValue(0, 1);
                break;
        }
    }

    // Enable input controls by adding event listeners
    enable() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    // Disable input controls by removing event listeners and resetting controls
    disable() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        // Reset vehicle controls
        this.vehicle.setWheelForce(0, 0);
        this.vehicle.setWheelForce(0, 1);
        this.vehicle.setSteeringValue(0, 0);
        this.vehicle.setSteeringValue(0, 1);
    }
}

export default Controls;

