// time.js
export default class Time {
    constructor(initialTime) {
        this.initialTime = initialTime;
        this.time = initialTime;
        this.state = "start";
        this.count = 3;
        this.countdownInterval = null;
        this.timerInterval = null;
    }

    // Method to stop the timer and show the game-over screen if time runs out
    stopTime() {
        if (this.time === 0 && this.state === "running") {
            clearInterval(this.timerInterval); // Stop the timer
            this.state = "stopped"; // Update the state
            window.location.href = 'lostScreen1.html'; // Redirect to lost screen
        }
        else if (this.time !== 0 && this.state === "stopped") {
            clearInterval(this.countdownInterval);
            window.location.href = '../html/winScreen1.html';
        }
    }

    // Method to start the main timer after the countdown finishes
    runTime() {
        this.state = "running"; // Update state to running
        this.timerInterval = setInterval(() => {
            this.time -= 1; // Decrease time
            const stopwatch = document.getElementById('stopwatch');
            if (stopwatch) {
                stopwatch.innerText = this.time; // Update stopwatch display
            }
            this.stopTime(); // Check if time should stop
        }, 1000); // Update every second
    }

    // Method to handle the countdown from 3
    startTime() {
        this.countdownInterval = setInterval(() => {
            this.count -= 1; // Decrease countdown
            console.log(this.count);
            const countdown = document.getElementById('countdown');
            if (countdown) {
                countdown.innerText = this.count; // Update countdown display
            }

            if (this.count === 0) {
                clearInterval(this.countdownInterval); // Stop the countdown
                const countdownDisplay = document.getElementById('countdown');
                if (countdownDisplay) {
                    countdownDisplay.innerText = ''; // Clear the countdown display
                }
                this.runTime(); // Start the main timer
            }
        }, 1000); // Update every second
    }

    // Method to check win condition based on completed laps
    checkWinCondition(completedLaps) {
        const requiredLaps = 3; // Example requirement
        if (completedLaps >= requiredLaps) {
            clearInterval(this.timerInterval);
            this.state = "stopped";
            window.location.href = '../html/winScreen1.html';
        }
    }
}
