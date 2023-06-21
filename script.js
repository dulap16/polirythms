const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");

const colors = [
    "#D0E7F5",
    "#D9E7F4",
    "#D6E3F4",
    "#BCDFF5",
    "#B7D9F4",
    "#C3D4F0",
    "#9DC1F3",
    "#9AA9F4",
    "#8D83EF",
    "#AE69F0",
    "#D46FF1",
    "#DB5AE7",
    "#D911DA",
    "#D601CB",
    "#E713BF",
    "#F24CAE",
    "#FB79AB",
    "#FFB6C1",
    "#FED2CF",
    "#FDDFD5",
    "#FEDCD1"
];


const initialise = () => {
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
    pen.strokeStyle = "#D0D0D0";
    pen.fillStyle = "#D0D0D0";

    pen.beginPath();
    pen.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
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
const calculateAngVelocities = (nrOfArcs) => {
    let totalTimeOfSimulation = 300;
    let totalDistTravelled = 100 * Math.PI;

    for (i = 0; i < nrOfArcs; i++) {
        angularVelocities[i] = totalDistTravelled / totalTimeOfSimulation;
        totalDistTravelled = totalDistTravelled - 2 * Math.PI;

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

    for (i = 0; i < nrOfArcs; i++) {
        currRadius = currRadius + spaceBetweenArcs;
        drawArc(center, currRadius, colors[i + 7])

        let angOfCurrCircle = angularVelocities[i] * timeElapsed;
        angOfCurrCircle = angOfCurrCircle % (2 * Math.PI);
        if (angOfCurrCircle < Math.PI)
            angOfCurrCircle = 2 * Math.PI - angOfCurrCircle;

        drawCircleAtAngle(angOfCurrCircle, currRadius, circleRadius, center);
    }

    requestAnimationFrame(draw);
}

function main() {
    initialise();
    calculateAngVelocities(10);

    draw(10);
}


main();