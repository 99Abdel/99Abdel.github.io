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

function drawLines(x, y, rect, ctx) {
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

function showCoordinates(event) {
    let ctx = this.getContext("2d");
    let rect_cnv = ctx.canvas.getBoundingClientRect();

    let x = Math.floor(event.clientX - rect_cnv.left);
    let y = Math.floor(event.clientY - rect_cnv.top);

    x = (x >= 0) ? x : 0;
    y = (y >= 0) ? y : 0;

    //drawLines(x, y, rect_cnv, ctx);

    let text = "X coords: " + x + ", Y coords: " + y;
    document.getElementById("hoverOuput").innerHTML = text;
    return { x: x, y: y };
}

function drawRectangleArea(xa, ya, xb, yb, ctx) {
    ctx.fillStyle = "skyblue";
    ctx.beginPath();
    ctx.fillRect(xa, ya, xb, yb);
    ctx.closePath();
}

function chooseRectText(x, y, width, height, ctx) {
    let c_x = Math.floor(width / 2);
    let c_y = Math.floor(height / 2);

    if (y <= c_y) {
        if (x < c_x) {
            // North West
            drawRectangleArea(0, 0, c_x, c_y, ctx); // Draw rectangle in the North West
            return { text: "North West", fx: 0, fy: 0 };
        } else {
            // North East
            drawRectangleArea(c_x, 0, width - c_x, c_y, ctx); // Correct width: (width - c_x)
            return { text: "North East", fx: width, fy: 0 };
        }
    } else {
        if (x < c_x) {
            // South West
            drawRectangleArea(0, c_y, c_x, height - c_y, ctx); // Correct height: (height - c_y)
            return { text: "South West", fx: 0, fy: height };
        } else {
            // South East
            drawRectangleArea(c_x, c_y, width - c_x, height - c_y, ctx); // Correct width/height
            return { text: "South East", fx: width, fy: height };
        }
    }
}


function clickWriteCoordinates(event) {
    let coords = showCoordinates.call(this, event);

    let ctx = cnv.getContext("2d");
    let rect = ctx.canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height); // Pulire il canvas
    
    chosenInfo = chooseRectText(coords.x, coords.y, rect.width, rect.height, ctx);
    ctx.font = text_style;
    let offset = ctx.measureText(chosenInfo.text).width / 2;

    let border_tol_x = 24, border_tol_y = 36;
    let inn_rect_tol_x = 20, inn_rect_tol_y = 34;

    let x = rect.width/2 - offset - border_tol_x;
    let y = rect.height/2 - border_tol_y;
    let w = offset*2 + border_tol_x * 2;
    let h = border_tol_y * 2 -10;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.fillRect( x, y, w, h);


    x = rect.width/2 - offset - inn_rect_tol_x;
    y = rect.height/2 - inn_rect_tol_y;
    w = offset * 2 + inn_rect_tol_x * 2;
    h = inn_rect_tol_y * 2 -10;
    ctx.fillStyle = "skyblue";
    ctx.fillRect(x, y, w, h);
    ctx.closePath();

    ctx.fillStyle = "black";
    ctx.fillText(chosenInfo.text, rect.width / 2 - offset, rect.height / 2);

    document.getElementById("clickedOutput").innerHTML = "Clicked:\t X coords: " + coords.x + ", Y coords: " + coords.y;
}



let cnv = document.getElementById("oneCanvas");
let text_to_show = "Click";
const text_style = "bold 24px serif";
// Aggiorna la dimensione del canvas e adatta al device pixel ratio
resizeCanvasToDisplaySize(cnv);

// Collegare gli eventi
cnv.onclick = clickWriteCoordinates;
cnv.onmousemove = showCoordinates;
