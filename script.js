const canvas = document.getElementById("canvas");
const slider = document.getElementById("slider");
const soundToggle = document.getElementById("sound-toggle");
const pen = canvas.getContext("2d");


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
        });
}

const initAll = () => {
    initVolumeSlider();
    initCanvas();
    initArcs();

    draw();
}

class Arc {
    constructor(angVelocity, color, sound, centerRadius) {
        this.angVelocity = angVelocity;
        this.color = color;
        this.sound = sound;
        this.centerRadius = centerRadius;

        this.nextHit = 0;
        this.calculateNextHit();
    };

    get getAngVeclocity() {
        return this.angVelocity;
    };

    get getNextHit() {
        return this.nextHit;
    };

    get getColor() {
        return this.color;
    };

    get getSound() {
        return this.sound;
    };

    get getCenterRadius() {
        return this.centerRadius;
    };

    calculateNextHit = () => {
        this.nextHit = this.nextHit + (Math.PI / this.angVelocity);
    };

    changeVolume = (newVolume) => {
        this.sound.volume = newVolume;
    };

    drawArc = () => {
        pen.strokeStyle = this.color;

        pen.beginPath();
        pen.arc(baselineCenter.x, baselineCenter.y - 7, this.centerRadius, Math.PI * 1, 2 * Math.PI);
        pen.stroke();
    };
};

let arcs = [];

const initArcs = () => {
    for(let i = 0; i < nrOfArcs; i++) {
        let currVelocity = calculateVelocityOfArc(i);
        arcs.push(new Arc(currVelocity, colors[i], getSoundByIndex(i + 1), spaceBetweenArcs * (i + 1)));
    }
}

const calculateVelocityOfArc = (index) => {
    let distTravelledByThisCircle = distTravelledByFirstCircle - index * decreaseRate;
    let velocity = distTravelledByThisCircle / timeOfSimulation;

    return velocity;
}

let baselineLength, spaceBetweenArcs, circleRadius;
let startPoint, endPoint, baselineCenter;
const initPoints = () => {
    startPoint = {
        x: canvas.width * 0.1,
        y: canvas.height * 0.9
    };

    endPoint = {
        x: canvas.width * 0.9,
        y: canvas.height * 0.9
    };  

    baselineCenter = {
        x: (startPoint.x + endPoint.x) / 2,
        y: startPoint.y
    };

    baselineLength = endPoint.x - startPoint.x;
    spaceBetweenArcs = (baselineLength / 2) / (nrOfArcs + 1);
    circleRadius = spaceBetweenArcs / 3.8;
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
};

document.body.addEventListener('click', function(event) {
    if (soundToggle.contains(event.target)) {
        toggleSoundClicked();
    }
});


let currentVolume = 0;
const initVolumeSlider = () => {
    slider.value = 30;
    currentVolume = slider.value;
};

const changeSystemVolume = (newValue) => {
    arcs.forEach(arc => {
        arc.changeVolume(newValue / 100)
    });

    currentVolume = slider.value;
};

const checkIfVolumeChanged = () => {
    if (currentVolume != slider.value) {
        changeSystemVolume(slider.value);
    }
};


const initNextHits = () => {
    for (let i = 0; i < nrOfArcs; i++) {
        nextHits[i] = calculateNextHit(0, angularVelocities[i]);
    }
};

const getSoundByIndex = (index) => {
    let currSound = new Audio('sounds/key' + index + '.mp3');
    currSound.volume = 0.1;

    return currSound;
};

const stopSound = (sound) => {
    sound.pause();
    sound.currentTime = 0;
};


const initCanvas = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    pen.lineWidth = 4;

    initPoints();
};

const drawBaseLine = () => {
    pen.lineWidth = 4;
    pen.strokeStyle = colors[5];

    pen.beginPath();
    pen.moveTo(startPoint.x, startPoint.y);
    pen.lineTo(endPoint.x, endPoint.y);
    pen.stroke();
};

const drawCircle = (pos, radius) => {
    pen.strokeStyle = "white";
    pen.fillStyle = "white";

    pen.beginPath();
    pen.arc(pos.x, pos.y - 7, radius, 0, 2 * Math.PI);
    pen.fill();
};

const drawCircleAtAngle = (angle, distFromCenter) => {
    const x = Math.cos(angle) * distFromCenter;
    const y = Math.sin(angle) * distFromCenter;

    const circlePos = {
        x: x + baselineCenter.x,
        y: y + baselineCenter.y
    };

    drawCircle(circlePos, circleRadius);
};

const playSoundIfCircleHitBaseline = (arc, elapsedTime) => {
    if (elapsedTime >= arc.getNextHit) {
        arc.calculateNextHit();

        if (soundOn) {
            arc.getSound.play();
            setTimeout(stopSound, 2000, arc.getSound);
        }
    }
};

const moveCircleOnArc = (arc, elapsedTime) => {
    let angOfCurrCircle = arc.getAngVeclocity * elapsedTime;
    angOfCurrCircle = angOfCurrCircle % (2 * Math.PI);
    if (angOfCurrCircle < Math.PI)
        angOfCurrCircle = 2 * Math.PI - angOfCurrCircle;

    drawCircleAtAngle(angOfCurrCircle, arc.getCenterRadius);
};

const startTime = Date.now();

let currRadius = 0;
const draw = () => {
    checkIfVolumeChanged();
    
    let currentTime = Date.now();
    const timeElapsed = (currentTime - startTime) / 1000;

    pen.clearRect(0, 0, canvas.width, canvas.height);

    drawBaseLine();

    for (let i = 0; i < nrOfArcs; i++) {
        arcs[i].drawArc();

        moveCircleOnArc(arcs[i], timeElapsed);

        playSoundIfCircleHitBaseline(arcs[i], timeElapsed);
    }

    requestAnimationFrame(draw);
}



function main() {
    initSettings();

    setTimeout(initAll, 300);
}


main();