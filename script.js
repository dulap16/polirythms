const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");

const initialise = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    pen.strokeStyle = "#D0D0D0";
    pen.fillStyle = "#D0D0D0";
    pen.lineWidth = 4;
}
const drawBaseLine = (startPoint, endPoint) => {
    pen.lineWidth = 4;

    pen.beginPath();
    pen.moveTo(startPoint.x, startPoint.y);
    pen.lineTo(endPoint.x, endPoint.y);
    pen.stroke();
}

const drawCircle = (pos, radius) => {
    pen.beginPath();
    pen.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    pen.fill();
}


const drawArc = (center, radius) => {
    pen.beginPath();
    pen.arc(center.x, center.y, radius, Math.PI, 2 * Math.PI);
    pen.stroke();
}

const drawAllArcs = (start, end, nrOfArcs) => {
    let length = end.x - start.x;

    const center = {
        x: (end.x + start.x) / 2,
        y: start.y
    };

    let space = (length / 2) / (nrOfArcs + 1);
    let circleRadius = space / 3.8;
    let currRadius = 0;
    for (var i = 0; i < nrOfArcs; i++) {
        currRadius = currRadius + space;
        drawArc(center, currRadius)

        let circlePos = {
            x: center.x - currRadius,
            y: center.y
        };
        drawCircle(circlePos, circleRadius);
    }
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
const calculateAngVelocities = (nrOfArcs) => {
    let totalTimeOfSimulation = 900;
    let totalDistTravelled = 100 * Math.PI;

    for (i = 0; i < nrOfArcs; i++) {
        angularVelocities[i] = totalDistTravelled / totalTimeOfSimulation;
        totalDistTravelled = totalDistTravelled - 4 * Math.PI;

        console.log(angularVelocities[i]);
    }
}


const startTime = Date.now();

let nrOfArcs = 10;
let currRadius = 0;
let time = 900;
const draw = () => {
    let currRadius = 0;
    let currentTime = Date.now();
    const timeElapsed = (currentTime - startTime) / 1000;
    console.log(timeElapsed);

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

    for (var i = 0; i < nrOfArcs; i++) {
        currRadius = currRadius + spaceBetweenArcs;
        drawArc(center, currRadius)

        let angOfCurrCircle = angularVelocities[i] * timeElapsed;

        drawCircleAtAngle(4.2, currRadius, circleRadius, center);
    }

    // drawArc(center, radius);

    requestAnimationFrame(draw);
}

function main() {
    initialise();
    calculateAngVelocities();

    draw(10);
}


main();