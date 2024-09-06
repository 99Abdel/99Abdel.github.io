// Funzione per adattare il canvas alla risoluzione del dispositivo
function resizeCanvasToDisplaySize(canvas) {
    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio; // Ottieni il device pixel ratio
    console.log(scale);
    // Modifica la dimensione interna del canvas per adattarla al device pixel ratio
    canvas.width = Math.floor(rect.width * scale);
    canvas.height = Math.floor(rect.height * scale);

    // Scala il contesto per renderizzare con maggiore risoluzione
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
}

/**
 * draws 2 lines one vertical and one horizontal from one edge to the other of the rectangle
 * @param {number} x 
 * @param {number} y 
 * @param {dict} rect dictionary containing width and height of the rectangle area
 * @param {*} ctx 
 * @param {string} color 
 */
function drawLines(x, y, rect, ctx, color="red") {
    ctx.clearRect(0, 0, rect.width, rect.height); // Pulire il canvas
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(rect.width, y);
    ctx.moveTo(x, 0);
    ctx.lineTo(x, rect.height);
    ctx.stroke();
    ctx.closePath();
}

/**
 * gets the coordinates of the pointer relative to the rectangle area of the owner
 * @param {*} event 
 * @returns {dict} {x,y} coordinates
 */
function getCoordinates(event) {
    let ctx = this.getContext("2d");
    let rect_cnv = ctx.canvas.getBoundingClientRect();

    let x = Math.floor(event.clientX - rect_cnv.left);
    let y = Math.floor(event.clientY - rect_cnv.top);

    x = (x >= 0) ? x : 0;
    y = (y >= 0) ? y : 0;

    let text = "X coords: " + x + ", Y coords: " + y;
    document.getElementById("hoverOuput").innerHTML = text;
    return { x: x, y: y };
}


function initialCoordinates(event) {
    is_mouse_down = true;
    ini_coords = getCoordinates.call(this, event);
    flag = 1;
    document.getElementById("clickedOutput").innerHTML = "IniCoord: (x,y) (" + ini_coords.x + ", " + ini_coords.y + ")";
}

function finalCoordinates(event){
    is_mouse_down = false;
    let ctx = cnv.getContext("2d");
    fin_coords = getCoordinates.call(this, event);
    
    if(is_control_pressed)
        flag = 0;

    if(flag){
        drawRect(ini_coords.x, ini_coords.y, fin_coords.x, fin_coords.y, ctx);
        document.getElementById("clickedOutput").innerHTML += " | FinalCoord: (x,y) (" + fin_coords.x + ", " + fin_coords.y + ")";
        rightShift(colors);
    }
    flag = 0;
}

/**
 * Draws a rectangle by having 2 points then returns the parameters used to dray the rectangle
 * @param {*} xa x coordinate of first point
 * @param {*} ya y coordinare of first point
 * @param {*} xb x coordinate of second point
 * @param {*} yb y coordinate of second point
 * @returns a dictionary with (x,y) coordinates on top left, the width and height of the rectangle.
 */
function drawRect(xa, ya, xb, yb, ctx){
    let x, y, w, h;
    if(xb >= xa){
        x = xa;
        w = xb-xa;
    }
    else{
        x = xb;
        w = xa - xb;
    }
    if(yb >= ya){
        y = ya;
        h = yb - ya;
    }
    else{
        y = yb;
        h = ya - yb;
    }

    ctx.fillStyle = colors[last];
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.fillRect(x, y, w, h);
    ctx.closePath();
    return {x:x, y:y, w:w, h:h};
}

/**
 * shifts all elements by one position to the right of the given array
 * @param {*} array 
 */
function rightShift(array){
    let ele = array[last];
    for(let i = last; i > 0; i--){
        array[i] = array[i-1];
    }
    array[0] = ele;
}

function changeBkgrndCol(event){
    cnv.style.backgroundColor = bkgrnd_cols[index];
    index = (index+1)%bkgrnd_cols.length;
}

function readPressedButton(event){
    if(event.key == "Control"){
        is_control_pressed = true;
    }
    else if (event.key == "Shift"){
        is_shift_pressed = true;
    }
    checkCondition();
}

function readReleasedButton(event){
    if(event.key == "Control"){
        is_control_pressed = false;
    }
    else if (event.key == "Shift"){
        is_shift_pressed = false;
    }
}

function checkCondition(){
    ctx = cnv.getContext("2d");
    if(is_control_pressed && is_shift_pressed && is_mouse_down){
        let rect_cnv = ctx.canvas.getBoundingClientRect();
        ctx.clearRect(0,0,rect_cnv.width, rect_cnv.height);
    }
}

const colors = ["darkred", "darkgreen", "gold", "skyblue", "aquamarine", "purple"];
let last = colors.length - 1;
let flag = 0;

let ini_coords, fin_coords;

let bkgrnd_cols = ["white", "antiquewhite", "azure"];
let index = 0;

let cnv = document.getElementById("oneCanvas");
resizeCanvasToDisplaySize(cnv); // Aggiorna la dimensione del canvas e adatta al device pixel ratio


// Collegare gli eventi
cnv.onmousedown = initialCoordinates;
cnv.onmousemove = getCoordinates;
cnv.onmouseup = finalCoordinates;
cnv.onmouseover = changeBkgrndCol;
cnv.onmouseout = changeBkgrndCol;


let is_mouse_down = false;
let is_control_pressed = false;
let is_shift_pressed = false;

document.onkeydown = readPressedButton;
document.onkeyup = readReleasedButton;