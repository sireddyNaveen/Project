var canvas,
    context,
    dragging = false,
    dragStartLocation,    
    snapshot;
 var imagesize;

function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function takeSnapshot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    context.putImageData(snapshot, 0, 0);
}

function drawLine(position) {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(position.x, position.y);
    context.stroke();
}

function drawCircle(position) {
    var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
    context.beginPath();
    context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI, false);
}

function drawPolygon(position, sides, angle) {
    var coordinates = [],
        radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2)),
        index = 0;

    for (index = 0; index < sides; index++) {
        coordinates.push({x: dragStartLocation.x + radius * Math.cos(angle), y: dragStartLocation.y - radius * Math.sin(angle)});
        angle += (2 * Math.PI) / sides;
    }

    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);
    for (index = 1; index < sides; index++) {
        context.lineTo(coordinates[index].x, coordinates[index].y);
    }

    context.closePath();
}

function draw(position) {

    var fillBox = document.getElementById("fillBox"),
        shape = document.querySelector('input[type="radio"][name="shape"]:checked').value,
        polygonSides = document.getElementById("polygonSides").value,
        polygonAngle = document.getElementById("polygonAngle").value,
        lineCap = document.querySelector('input[type="radio"][name="lineCap"]:checked').value,
        composition = document.querySelector('input[type="radio"][name="composition"]:checked').value;

    context.lineCap = lineCap;
    context.globalCompositeOperation = composition;

    if (shape === "circle") {
        drawCircle(position);
    }
    if (shape === "line") {
        drawLine(position);
    }

    if (shape === "polygon") {
        drawPolygon(position, polygonSides, polygonAngle * (Math.PI / 180));
    }

    if (shape !== "line") {
        if (fillBox.checked) {
            context.fill();
        } else {
            context.stroke();
        }
    }
}

function dragStart(event) {
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);
    takeSnapshot();
}

function drag(event) {
    var position;
    if (dragging === true) {
        restoreSnapshot();
        position = getCanvasCoordinates(event);
        draw(position);
    }
}

function dragStop(event) {
    dragging = false;
    restoreSnapshot();
    var position = getCanvasCoordinates(event);
    draw(position);
}

function changeLineWidth() {
    context.lineWidth = this.value;
    event.stopPropagation();
}

function changeFillStyle() {
    context.fillStyle = this.value;
    event.stopPropagation();
}

function changeStrokeStyle() {
    context.strokeStyle = this.value;
    event.stopPropagation();
}

function changeBackgroundColor() {
    context.save();
    context.fillStyle = document.getElementById("backgroundColor").value;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function eraseCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function btncircleclick()
{   
    radiobtn = document.getElementById("circle");
    radiobtn.checked = true;
}

function btnlineclick()
{
    radiobtn = document.getElementById("line");
    radiobtn.checked = true;
}
function btnpolygonclick()
{
    radiobtn = document.getElementById("polygon");
    radiobtn.checked = true;
}


  function zoomIn() {
    imagesize = imagesize - 50; 
    document.getElementById('canvas').style.height= imagesize;
    document.getElementById('canvas').style.width= imagesize;
    console.log(" zoomIn imagesize" + imagesize);
}

 function zoomOut() {
    imagesize = imagesize + 50;
     
    document.getElementById('canvas').style.height= imagesize ;
    document.getElementById('canvas').style.width= imagesize;
  console.log(" zoomOut imagesize" + imagesize);
};



function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    var lineWidth = document.getElementById("lineWidth"),
        fillColor = document.getElementById("fillColor"),
        strokeColor = document.getElementById("strokeColor"),
        canvasColor = document.getElementById("backgroundColor"),
        clearCanvas = document.getElementById("clearCanvas");

    context.strokeStyle = strokeColor.value;
    context.fillStyle = fillColor.value;
    context.lineWidth = lineWidth.value;


    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
    lineWidth.addEventListener("input", changeLineWidth, false);
    fillColor.addEventListener("input", changeFillStyle, false);
    strokeColor.addEventListener("input", changeStrokeStyle, false);
    canvasColor.addEventListener("input", changeBackgroundColor, false);
    clearCanvas.addEventListener("click", eraseCanvas, false);

    imagesize = document.getElementById("canvas").offsetWidth;

    var canvas1 = document.getElementById("canvas")
, scale = document.getElementById("scale");

scale.addEventListener("change", function(e) {
    canvas1.style.transform = "scale(" 
  + e.target.value 
  + ","      
  + e.target.value 
  + ")"
})
}

function clearstorage(){
    eraseCanvas();
    localStorage.clear();
}
function save(){ 
    var tabelaContent = document.getElementById("can").innerHTML;

    localStorage.setItem("tabelaContent", canvas.toDataURL());
    console.log("save  "+  tabelaContent);
    
}

function loading()
{ 
    console.log("load  "+   localStorage.getItem("tabelaContent")); 
        var dataURL = localStorage.getItem("tabelaContent");
        var img = new Image;
        img.src = dataURL;
        img.onload = function () {
        context.drawImage(img, 0, 0);
};

}

window.addEventListener('load', init, false);