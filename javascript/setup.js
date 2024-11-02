// Variable to keep track of selected track
let selectedTrack = '';
let carSelected = false;
let modeSelected = false;

const selections = {
  track: '',
  car: '',
  mode: ''
};

// Initialize selections in sessionStorage
sessionStorage.setItem('selections', JSON.stringify(selections));

// Helper function to update selection in sessionStorage
function setSelection(key, value) {
  const selections = JSON.parse(sessionStorage.getItem('selections'));
  selections[key] = value;
  sessionStorage.setItem('selections', JSON.stringify(selections));
}

// Handle keydown for Controls (C) and Game Aim (G) popups
document.addEventListener('keydown', (event) => {
  if (event.key === 'C' || event.key === 'c') {
    showPopup('controls-popup');
  }
  if (event.key === 'G' || event.key === 'g') {
    showPopup('game-aim-popup');
  }
});

// Function to select a track and display info
function selectTrack(track) {
  selectedTrack = track;
  setSelection("track", track);

  // Set the information based on the track
  const trackTitle = document.getElementById('track-info-title');
  const trackDescription = document.getElementById('track-info-description');

  if (track === 'Track 2') {
    trackTitle.innerText = "Level 2";
    trackDescription.innerText = "Welcome to Level 2! In this lane try to avoid obstacles with all you've got. When you hit an obstacle YOU DIE!";
  } else if (track === 'Track 4') {
    trackTitle.innerText = "Level 4";
    trackDescription.innerText = "Welcome to Level 4! Prepare for your last adventure where you will have to outrun enemy cars, your health declines with every collosion, stay within your lane or your health will decline.Lastly aim to pick as many fuel cans as possible and finish first. Goodluck!";
  } else if (track === 'Track 1') {
    trackTitle.innerText = "Level 1";
    trackDescription.innerText = "Welcome to Level 1! A beginner-friendly track to get you started with basic racing controls. You race against time. Goodluck!";
  } else if (track === 'Track 3') {
    trackTitle.innerText = "Level 3";
    trackDescription.innerText = "Welcome to Level 3! Enjoy moderate challenges as you master your racing techniques.";
  }

  // Show the track information pop-up
  document.getElementById('track-info-popup').classList.remove('hidden');
}

// Function to select car
function selectCar(carName) {
  console.log('Car selected:', carName);
  setSelection("car", carName);
  carSelected = true;
  document.getElementById('car-selection').classList.add('hidden');
  document.getElementById('mode-selection').classList.remove('hidden');
}

// Function to select mode
function selectMode(modeName) {
  console.log('Mode selected:', modeName);
  setSelection("mode", modeName);
  modeSelected = true;
  document.getElementById('mode-selection').classList.add('hidden');
  document.getElementById('start-section').classList.remove('hidden');
}


function startTrack() {
    // Retrieve the latest selections from sessionStorage
    
    const selections = JSON.parse(sessionStorage.getItem('selections'));
    const selectedTrack = selections ? selections.track : null;

    // Navigate based on the selected track
    if (selectedTrack === 'Track 1') {
        window.location.href = 'level1.html';
    } else if (selectedTrack === 'Track 2') {
        window.location.href = 'level2.html';
    } else if (selectedTrack === 'Track 3') {
        window.location.href = 'level3.html';
    } else if (selectedTrack === 'Track 4') {
        window.location.href = 'level4.html';
    } else {
        alert("Please select a track before starting the race.");
    }
}

  

// Function to go back to main menu
function goBack() {
  window.location.href = '../html/mainMenu.html';
}

// Function to show popup
function showPopup(popupId) {
  document.getElementById(popupId).classList.remove('hidden');
}

// Function to close popup
function closePopup(popupId) {
  document.getElementById(popupId).classList.add('hidden');
}

//function to the next page to start the race

function next(){
    window.location.href = 'startRace.html';
}

function goPrev(){
    window.location.href ='setup.html';
}


