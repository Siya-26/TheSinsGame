let trackSelected = false;
let carSelected = false;
let modeSelected = false;

const selections = {
    track: '',
    car: '',
    mode: ''
};

sessionStorage.setItem('selections', JSON.stringify(selections));
function setSelection(key, value){
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

// Select track
function selectTrack(trackName) {
    console.log('Track selected:', trackName);
    setSelection("track", trackName);
    trackSelected = true;
    document.getElementById('track-selection').classList.add('hidden');
    document.getElementById('car-selection').classList.remove('hidden');
}

// Select car
function selectCar(carName) {
    console.log('Car selected:', carName);
    setSelection("car", carName);
    carSelected = true;
    document.getElementById('car-selection').classList.add('hidden');
    document.getElementById('mode-selection').classList.remove('hidden');
}

// Select mode
function selectMode(modeName) {
    console.log('Mode selected:', modeName);
    setSelection("mode", modeName);
    modeSelected = true;
    document.getElementById('mode-selection').classList.add('hidden');
    document.getElementById('start-section').classList.remove('hidden');
}

// Start game
function startGame() {
    if (trackSelected && carSelected && modeSelected) {
        
        
        window.location.href = 'level2.html'; 
    }
}


function goBack() {
    window.location.href = '../html/mainMenu.html'; // Redirect to main menu
}

// Show popup
function showPopup(popupId) {
    document.getElementById(popupId).classList.remove('hidden');
}

// Close popup
function closePopup(popupId) {
    document.getElementById(popupId).classList.add('hidden');
}
