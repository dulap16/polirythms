let colors = [];
let nrOfArcs = 0;
let timeOfSimulation = 0;
let distTravelledByFirstCircle = 0;
let decreaseRate = 0;

const initSettings = () => {
    fetch('./settings.json')
        .then((response) => response.json())
        .then((json) => {
            nrOfArcs = parseInt(json.nrOfArcs);
            timeOfSimulation = parseInt(json.timeOfSimulation);
            colors = json.colors;
            distTravelledByFirstCircle = parseInt(json.PITravelledByFirstCircle) * Math.PI;
            decreaseRate = parseInt(json.PIDecreaseRate) * Math.PI;

            console.log(nrOfArcs);
        });
}

const initAll = () => {
    initVolumeSlider();
    initCanvas();
    initAngVelocities();
    initSounds();
    initNextHits();

    draw();
}


const canvas = document.getElementById("canvas");
const slider = document.getElementById("slider");
const soundToggle = document.getElementById("sound-toggle");
const pen = canvas.getContext("2d");

class Arc {
    constructor(angVelocity, color, sound) {
        this.angVelocity = angVelocity;
        this.color = color;
        this.sound = sound;

        this.nextHit = 0;
        this.calculateNextHit();
    }

    get getAngVeclocity() {
        return this.angVelocity;
    }

    get getNextHit() {
        return this.nextHit;
    }

    get getColor() {
        return this.color;
    }

    get getSound() {
        return this.sound;
    }

    calculateNextHit = () => {
        this.nextHit = this.nextHit + (Math.PI / this.angVelocity);
    }

    changeVolumeOfArc = (newVolume) => {
        this.sound.volume = newVolume;
    }
};

let arcs = [];

const initArcs = () => {
    for(let i = 0; i < nrOfArcs; i++) {
        let currVelocity = calculateVelocityOfArc(i);
        arcs.append(new Arc(currVelocity, colors[i], getSoundByIndex(i)));
    }
}

const calculateVelocityOfArc = (index) => {
    let distTravelledByThisCircle = distTravelledByFirstCircle - index * decreaseRate;
    let velocity = distTravelledByThisCircle / timeOfSimulation;

    return velocity;
}

let startPoint, endPoint, center;
const initPoints = () => {
    startPoint = {
        x: canvas.width * 0.1,
        y: canvas.height * 0.9
    };

    endPoint = {
        x: canvas.width * 0.9,
        y: canvas.height * 0.9
    };  

    center = {
        x: (startPoint.x + endPoint.x) / 2,
        y: startPoint.y
    };
}

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


let currentVolume = 0;
const initVolumeSlider = () => {
    slider.value = 30;
    currentVolume = slider.value;
}

const changeSystemVolume = (newValue) => {
    arcs.forEach(arc => {
        arc.changeVolumeOfArc(newValue)
    })

    currentVolume = slider.value;
}

const checkIfVolumeChanged = () => {
    if (currentVolume != slider.value) {
        changeSystemVolume(slider.value);
    }
}


const initNextHits = () => {
    for (let i = 0; i < nrOfArcs; i++) {
        nextHits[i] = calculateNextHit(0, angularVelocities[i]);
    }
}

const getSoundByIndex = (index) => {
    let currSound = new Audio('sounds/key' + index + '.mp3');
    currSound.volume = 0.1;

    return currSound;
}

const stopSound = (sound) => {
    sound.pause();
    sound.currentTime = 0;
}


const initCanvas = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    pen.lineWidth = 4;

    initPoints();
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
const initAngVelocities = () => {
    let totalTimeOfSimulation = timeOfSimulation;
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

    setTimeout(initAll, 200);
}


main();