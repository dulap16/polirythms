let colors = [];
let nrOfArcs = 0;
let timeOfSimulation = 0;

const initSettings = () => {
    fetch('./settings.json')
        .then((response) => response.json())
        .then((json) => {
            nrOfArcs = json.nrOfArcs;
            timeOfSimulation = json.timeOfSimulation;
            colors = json.colors;

            console.log(nrOfArcs);
        });
}


const canvas = document.getElementById("canvas");
const slider = document.getElementById("slider");
const soundToggle = document.getElementById("sound-toggle");
const pen = canvas.getContext("2d");

let soundOn = false;
document.onvisibilitychange = () => {
    if (soundOn)
        toggleSoundClicked();
};

let nextHits = [];
let sounds = [];

function toggleSoundClicked() {
    if (soundOn) {
        soundOn = false;
        soundToggle.style.backgroundColor = "red";
    } else {
        soundOn = true;
        soundToggle.style.backgroundColor = "green";
    }
}

document.body.addEventListener('click', function(event) {
    if (soundToggle.contains(event.target)) {
        toggleSoundClicked();
    }
});


const calculateNextHit = (lastHit, angVelocity) => {
    const nextHit = lastHit + (Math.PI / angVelocity);

    return nextHit;
}


let currentVolume = 0;
const initVolumeSlider = () => {
    slider.value = 30;
    currentVolume = slider.value;
}

const changeVolume = (newValue) => {
    sounds.forEach(sound => {
        sound.volume = newValue / 200;
    });

    currentVolume = slider.value;
}

const checkIfVolumeChanged = () => {
    if (currentVolume != slider.value) {
        changeVolume(slider.value);
    }
}


const initNextHits = () => {
    for (let i = 0; i < nrOfArcs; i++) {
        nextHits[i] = calculateNextHit(0, angularVelocities[i]);
    }
}

const initSounds = () => {
    nrOfArcs = Math.min(nrOfArcs, 15);

    for (let i = 0; i < nrOfArcs; i++) {
        sounds[i] = new Audio('sounds/key' + (i + 1) + '.mp3');
        sounds[i].volume = 0.1;
    }
}

const stopSound = (sound) => {
    sound.pause();
    sound.currentTime = 0;
}


const initCanvas = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    pen.lineWidth = 4;
}

const drawBaseLine = (startPoint, endPoint) => {
    pen.lineWidth = 4;
    pen.strokeStyle = colors[5];

    pen.beginPath();
    pen.moveTo(startPoint.x, startPoint.y);
    pen.lineTo(endPoint.x, endPoint.y);
    pen.stroke();
}

const drawCircle = (pos, radius) => {
    pen.strokeStyle = "white";
    pen.fillStyle = "white";

    pen.beginPath();
    pen.arc(pos.x, pos.y - 7, radius, 0, 2 * Math.PI);
    pen.fill();
}


const drawArc = (center, radius, color) => {
    pen.strokeStyle = color;

    pen.beginPath();
    pen.arc(center.x, center.y - 7, radius, Math.PI * 1, 2 * Math.PI);
    pen.stroke();
}

const drawCircleAtAngle = (angle, distFromCenter, circleRadius, center) => {
    const x = Math.cos(angle) * distFromCenter;
    const y = Math.sin(angle) * distFromCenter;

    const circlePos = {
        x: x + center.x,
        y: y + center.y
    };

    drawCircle(circlePos, circleRadius);
}


let angularVelocities = [];
    let totalTimeOfSimulation = 450;
const initAngVelocities = () => {
    let totalDistTravelled = 100 * Math.PI;

    for (let i = 0; i < nrOfArcs; i++) {
        angularVelocities[i] = totalDistTravelled / totalTimeOfSimulation;
        totalDistTravelled = totalDistTravelled - 2 * Math.PI;
    }
}


const startTime = Date.now();


let currRadius = 0;
const draw = () => {
    checkIfVolumeChanged();

    let currRadius = 0;
    let currentTime = Date.now();
    const timeElapsed = (currentTime - startTime) / 1000;

    pen.clearRect(0, 0, canvas.width, canvas.height);


    const startPoint = {
        x: canvas.width * 0.1,
        y: canvas.height * 0.9
    }

    const endPoint = {
        x: canvas.width * 0.9,
        y: canvas.height * 0.9
    }

    const center = {
        x: (startPoint.x + endPoint.x) / 2,
        y: startPoint.y
    };

    drawBaseLine(startPoint, endPoint);


    let baselineLength = endPoint.x - startPoint.x;
    let spaceBetweenArcs = (baselineLength / 2) / (nrOfArcs + 1);
    let circleRadius = spaceBetweenArcs / 3.8;

    for (let i = 0; i < nrOfArcs; i++) {
        currRadius = currRadius + spaceBetweenArcs;
        drawArc(center, currRadius, colors[i]);

        let angOfCurrCircle = angularVelocities[i] * timeElapsed;
        angOfCurrCircle = angOfCurrCircle % (2 * Math.PI);
        if (angOfCurrCircle < Math.PI)
            angOfCurrCircle = 2 * Math.PI - angOfCurrCircle;

        drawCircleAtAngle(angOfCurrCircle, currRadius, circleRadius, center);

        if (timeElapsed >= nextHits[i]) {
            nextHits[i] = calculateNextHit(nextHits[i], angularVelocities[i]);

            if (soundOn) {
                sounds[i].play();
                setTimeout(stopSound, 2000, sounds[i]);
            }
        }
    }

    requestAnimationFrame(draw);
}

function main() {
    initSettings();

    initVolumeSlider();
    initCanvas();
    initAngVelocities(nrOfArcs);
    initSounds(nrOfArcs);
    initNextHits(nrOfArcs);

    draw(nrOfArcs);
}


main();