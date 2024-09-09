class Ball {

    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }

    setX = function (given_x) {
        this.x = given_x;
    }

    setY = function (given_y) {
        this.y = given_y;
    }

    /**
     * 
     * @param {boolean} given_sel 
     */
    setSelected = function(given_sel){
        this.selected = given_sel;
    }

    getDistance(other_x, other_y) {
        return Math.sqrt((this.x - other_x) ** 2 + (this.y - other_y) ** 2);
    }

    isInsidePoint(other_x, other_y) {
        let dist = this.getDistance(other_x, other_y);
        if (this.r > dist) {
            return true;
        }
    }

    /**
     * 
     * @param {Ball} circle 
     */
    isOverlappedCircle(circle) {
        let dist = this.getDistance(circle.x, circle.y);
        if ((this.r + circle.r) > dist) {
            true;
        }
    }

}

class MulticoloreBall extends Ball{

    constructor(x, y, r, col1, col2, col3){
        super(x,y,r,col1);
        this.color2 = col2;
        this.color3 = col3;
    }

}

/**
 * Draws a circle by having 2 points then returns the parameters used to draw the rectangle
 * @param {*} x_c x coordinate of center
 * @param {*} y_c y coordinare of center
 * @param {*} x x coordinate of second point
 * @param {*} y y coordinate of second point
 * @returns a dictionary with (x,y) coordinates on top left, the width and height of the rectangle.
 */
function drawCircle2Points(x_c, y_c, x, y, ctx) {
    let r;
    r = Math.sqrt((x_c - x) ** 2 + (y_c - y) ** 2);
    return drawCircle(x_c, y_c, r, ctx);
}


function drawCircle(x_c, y_c, r, ctx, color = "red", alpha = 0, beta = 2 * Math.PI, a = 1) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.arc(x_c, y_c, r, alpha, beta);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    return { x: x_c, y: y_c, r: r };
}


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


function checkIfInCircle(x, y) {
    let last = balls.length - 1;
    for (let i = last; i >= 0; i--) {
        if (balls[i].isInsidePoint(x, y)){
            balls[i].selected = true;
            return i;
        }
    }
    return null;
}


function moveBall(x, y, ctx, rect) {

    let last = balls.length - 1;
    balls[last].setX(x);
    balls[last].setY(y);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle ="black";

    for(let i =0; i < balls.length; i++){
        ctx.beginPath();
        ctx.fillStyle = balls[i].color;
        ctx.arc(balls[i].x, balls[i].y, balls[i].r, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

}

/**
 * shifts to left the elements of the array starting from the given point and puts the on selecte as last.
 * @param {*} array 
 * @param {int} ini initial element index if not give is 0
 */
function partialLeftShif(array, ini = 0){

    let last = array.length - 1;
    let ele = array[ini];
    for (let i = ini; i < last; i++) {
        array[i] = array[i + 1];
    }
    array[last] = ele;

}

/**
 * shifts all elements by one position to the right of the given array
 * @param {*} array 
 */
function rightShift(array) {
    let last = array.length - 1;
    let ele = array[last];
    for (let i = last; i > 0; i--) {
        array[i] = array[i - 1];
    }
    array[0] = ele;
}


/**
 * gets the coordinates of the pointer relative to the rectangle area of the owner
 * @param {*} event 
 * @returns {dict} {x,y} coordinates
 */
function getCoordinates(event) {
    let ctx = cnv.getContext("2d");
    let rect_cnv = ctx.canvas.getBoundingClientRect();

    let x = Math.floor(event.clientX - rect_cnv.left);
    let y = Math.floor(event.clientY - rect_cnv.top);

    x = (x >= 0) ? x : 0;
    y = (y >= 0) ? y : 0;

    if (flag) {
        moveBall(x, y, ctx, rect_cnv);
    }

    let text = "X coords: " + x + ", Y coords: " + y;
    document.getElementById("hoverOuput").innerHTML = text;
    return { x: x, y: y };
}


function initialCoordinates(event) {
    is_mouse_down = true;
    ini_coords = getCoordinates.call(this, event);
    let index = checkIfInCircle(ini_coords.x, ini_coords.y);
    if(index != null && !(is_control_pressed || is_shift_pressed)){
        partialLeftShif(balls, index);
        flag = 1;
    }
    else{
        checkCondition(event);
    }
    document.getElementById("clickedOutput").innerHTML = "IniCoord: (x,y) (" + ini_coords.x + ", " + ini_coords.y + ")";
}


function finalCoordinates(event) {
    is_mouse_down = false;
    let ctx = cnv.getContext("2d");
    fin_coords = getCoordinates.call(this, event);

    if (flag) {
        document.getElementById("clickedOutput").innerHTML += " | FinalCoord: (x,y) (" + fin_coords.x + ", " + fin_coords.y + ")";
    }
    flag = 0;
}


function readPressedButton(event){
    if(event.key == "Control"){
        is_control_pressed = true;
    }
    else if (event.key == "Shift"){
        is_shift_pressed = true;
    }
}

function readReleasedButton(event){
    if(event.key == "Control"){
        is_control_pressed = false;
    }
    else if (event.key == "Shift"){
        is_shift_pressed = false;
    }
}

function checkCondition(event){
    ctx = cnv.getContext("2d");
    if(is_control_pressed && is_mouse_down){
        let coor = getCoordinates(event);
        let r = 20 + Math.random()*180;
        if(!is_shift_pressed){
            let col_index = Math.floor(Math.random()*(colors.length - 1));
            let ball = new Ball(coor.x, coor.y, r, colors[col_index]);
            balls.push(ball);
            drawCircle(ball.x, ball.y, ball.r, ctx, ball.color);
        }
        else if(is_shift_pressed){
            let one_third = Math.PI/3;
            let a = 0
            let b = 2*Math.PI;
            let idx = Math.floor(Math.random()*(colors.length - 1));
            let col_index = [];

            for(let i = 0; i < 3; i++){
                drawCircle(coor.x, coor.y, r, ctx, colors[idx], a, b);
                a += one_third;
                b = -a;
                col_index.push(colors[idx]);
                idx = (idx + 1)%colors.length;
            }
            let ball = new MulticoloreBall(coor.x, coor.y, r, colors[col_index[0]], colors[col_index[1]], colors[col_index[2]]);
            balls.push(ball);
        }
        is_mouse_down = false;
    }
}



const colors = ["darkred", "darkgreen", "gold", "skyblue", "aquamarine", "purple"];
let flag = 0;
let once = false;

let ini_coords, fin_coords;

let bkgrnd_cols = ["white", "antiquewhite", "azure"];
let index = 0;

let cnv = document.getElementById("oneCanvas");
resizeCanvasToDisplaySize(cnv); // Aggiorna la dimensione del canvas e adatta al device pixel ratio
ctx = cnv.getContext("2d");

let ball1 = new Ball(50, 50, 20, "antiquewhite");
let ball2 = new Ball(200, 200, 100, "gold");
let ball3 = new Ball(500, 200, 50, "skyblue");
let ball4 = new Ball(500, 420, 40, "darkgreen");
drawCircle(ball1.x, ball1.y, ball1.r, ctx, ball1.color);
drawCircle(ball2.x, ball2.y, ball2.r, ctx, ball2.color);
drawCircle(ball3.x, ball3.y, ball3.r, ctx, ball3.color);
drawCircle(ball4.x, ball4.y, ball4.r, ctx, ball4.color);

let balls = [];
balls.push(ball1, ball2, ball3, ball4);


// crea un evento di mouse down e verifica se stai cliccando dentro all'area di un cerchio nell'array di cerchi sul canvas,
// mentre muovi il mouse e tasto giu sposta il cerchio nel mentre dovrai in continuazione disegnare gli altri cerchi sotto al canvas,
// quindi cancelli tutta la finestra e ridisegni tutto istantaneamente.
cnv.onmousedown = initialCoordinates;
cnv.onmousemove = getCoordinates.bind(cnv);
cnv.onmouseup = finalCoordinates;

let is_mouse_down = false;
let is_control_pressed = false;
let is_shift_pressed = false;

document.onkeydown = readPressedButton;
document.onkeyup = readReleasedButton;