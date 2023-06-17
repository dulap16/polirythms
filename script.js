const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const drawBaseLine = (startPoint, endPoint) => {



    pen.strokeStyle = "#D0D0D0";
    pen.lineWidth = 5;

    pen.beginPath();
    pen.moveTo(startPoint.x, startPoint.y);
    pen.lineTo(endPoint.x, endPoint.y);
    pen.stroke();
}


const drawArc = (center, radius) => {
    pen.beginPath();
    pen.arc(center.x, center.y, radius, 0, Math.PI);
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
    let currRadius = 0;
    for (var i = 0; i < nrOfArcs; i++) {
        currRadius = currRadius + space;
        drawArc(center, currRadius)
    }
}
    x: canvas.width * 0.1,
    y: canvas.height * 0.9
}

const endPoint = {
    x: canvas.width * 0.9,
    y: canvas.height * 0.9
}

drawBaseLine(startPoint, endPoint);