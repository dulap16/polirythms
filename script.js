const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");

const drawBaseLine = () => {

    const canvasPos = {
        x: canvas.clientLeft,
        y: canvas.clientTop
    };
    console.log(canvas.clientWidth + ' ' + canvas.clientHeight)


    const startPoint = {
        x: canvas.width * 0.1,
        y: canvas.height * 0.9
    }

    const endPoint = {
        x: canvas.width * 0.9,
        y: canvas.height * 0.9
    }

    console.log(startPoint.x + ' ' + startPoint.y + '\n' + endPoint.x + ' ' + endPoint.y);

    pen.strokeStyle = "#D0D0D0";
    pen.lineWidth = 5;


    pen.beginPath();
    pen.moveTo(startPoint.x, startPoint.y);
    pen.lineTo(endPoint.x, endPoint.y);
    pen.stroke();
}

drawBaseLine();