
const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");
let canvasWidth = canvas.scrollWidth;
let canvasHeight = canvas.scrollHeight;

let centerx = canvasWidth / 2;
let centery = (canvasHeight / 10) * 9;
let initRadius = 100;

pen.fillStyle = "#000000";
pen.beginPath();
pen.arc(centerx, centery, initRadius, 0, Math.PI);
pen.stroke();

