export const enableInputControls = (vehicle, maxForce, maxSteerVal) => {
    let isSteering = false; // Track if steering is active
    const brakeForce = -maxForce * 1.0; // Strong braking force

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                vehicle.setWheelForce(maxForce, 2); // Rear left wheel
                vehicle.setWheelForce(maxForce, 3); // Rear right wheel
                break;

            case 's':
            case 'ArrowDown':
                vehicle.setWheelForce(-maxForce / 2, 2); // Reverse force
                vehicle.setWheelForce(-maxForce / 2, 3);
                break;

            case 'a':
            case 'ArrowLeft':
                if (!isSteering) {
                    isSteering = true;
                    applySteering(vehicle, maxSteerVal); // Steer left with speed adjustment
                }
                break;

            case 'd':
            case 'ArrowRight':
                if (!isSteering) {
                    isSteering = true;
                    applySteering(vehicle, -maxSteerVal); // Steer right with speed adjustment
                }
                break;

            case ' ':
                // Apply braking force to rear wheels
                vehicle.setWheelForce(brakeForce, 2);
                vehicle.setWheelForce(brakeForce, 3);

                // Optionally, apply temporary linear damping to the chassis body
                vehicle.chassisBody.linearDamping = 0.9; // Increase damping to slow down
                break;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (['a', 'ArrowLeft', 'd', 'ArrowRight'].includes(event.key)) {
            isSteering = false; // Reset steering when key is released
            vehicle.setSteeringValue(0, 0); // Front left wheel
            vehicle.setSteeringValue(0, 1); // Front right wheel
        }

        if (['w', 'ArrowUp', 's', 'ArrowDown', ' '].includes(event.key)) {
            vehicle.setWheelForce(0, 2); // Stop rear left wheel
            vehicle.setWheelForce(0, 3); // Stop rear right wheel

            // Reset linear damping to normal after braking
            vehicle.chassisBody.linearDamping = 0.1;
        }
    });
};

// **Apply speed-sensitive steering**
const applySteering = (vehicle, steerValue) => {
    // Get the car's current speed
    const speed = vehicle.chassisBody.velocity.length();

    // Reduce steering angle based on speed
    const speedFactor = Math.max(1 - speed / 30, 0.3); // Prevent it from going below 30%
    const adjustedSteerValue = steerValue * speedFactor;

    // Apply the adjusted steering to the front wheels
    vehicle.setSteeringValue(adjustedSteerValue, 0); // Front left wheel
    vehicle.setSteeringValue(adjustedSteerValue, 1); // Front right wheel
};


