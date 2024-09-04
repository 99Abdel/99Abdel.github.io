
function drawFullStairDesc(x0, y0, L, N, ctx, step_colors) {
    let xa, ya, xb, yb;
    xa = x0; ya = y0;

    let j = 0;

    for (let i = 0; i < N; i++) {

        xb = xa + L * (i + 1);
        yb = ya;
        ctx.moveTo(xa, ya);
        ctx.lineTo(xb, yb);

        yb = ya + L;

        if (step_colors.length > 1) {
            ctx.fillStyle = step_colors[j];
            j = (j + 1) % step_colors.length;
        }
        ctx.fillRect(xa, ya, xb - xa, yb - ya);

        xa = xb;
        ctx.moveTo(xa, ya);
        ctx.lineTo(xb, yb);

        xa = x0;
        ya = yb;

    }

    ctx.moveTo(xb, yb);
    ctx.lineTo(x0, yb);
    ctx.moveTo(x0, yb);
    ctx.lineTo(x0, y0);
    ctx.stroke();

    return [xb, yb];
}


function drawFullPiramid(x0, y0, L, N, ctx, step_colors) {
    let xa, ya, xb, yb;
    xa = x0; ya = y0;
    let n_xa;
    let j = 0;

    for (let i = 0; i < N; i++) {

        xb = xa + L * (i + 1);
        yb = ya;
        n_xa = xa - L * (i+1);
        ctx.moveTo(n_xa, ya);
        ctx.lineTo(xb, yb);

        yb = ya + L;

        if (step_colors.length > 1) {
            ctx.fillStyle = step_colors[j];
            j = (j + 1) % step_colors.length;
        }
        ctx.fillRect(n_xa, ya, xb - n_xa, yb - ya);

        xa = xb;
        ctx.moveTo(xa, ya);
        ctx.lineTo(xb, yb);
        ctx.moveTo(n_xa, ya);
        ctx.lineTo(n_xa, yb);
        xa = x0;
        ya = yb;
    }

    ctx.moveTo(xb, yb);
    ctx.lineTo(n_xa, yb);
    ctx.stroke();

    return [xb, yb];
}


function drawStairAsce(x0, y0, L, N, ctx) {
    let xa, ya, xb, yb;
    xa = x0; ya = y0;

    for (let i = 0; i < N; i++) {

        xb = xa;
        yb = ya - L;
        ctx.beginPath();
        ctx.moveTo(xa, ya);
        ctx.lineTo(xb, yb);
        ctx.stroke();
        ctx.closePath();

        drawHorizCircles(xa + L / 2, ya - L / 2, L / 2, N - i, ctx);

        xb = xa + L;
        ya = yb;
        ctx.beginPath();
        ctx.moveTo(xa, ya);
        ctx.lineTo(xb, yb);
        ctx.stroke();
        ctx.closePath();
        xa = xb;
    }

    return [xb, yb];
}

function drawHorizCircles(x0, y0, r, N, ctx) {
    let x, y;

    for (let i = 0; i < N; i++) {
        ctx.beginPath();
        ctx.fillStyle = getRandomColor();
        x = x0 + 2 * r * i;
        ctx.arc(x, y0, r, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
    }
}

function getRandomColor() {
    let random_color_as_int = Math.floor(Math.random() * 0xFFFFFF);
    // We'll convert the int value to a hexadecimal string, ensuring that
    // there will be enough leading zeroes so that the string length is at least 6.
    let random_color_as_string = "000000" + random_color_as_int.toString(16);
    random_color_as_string = random_color_as_string.slice(random_color_as_string.length - 6);
    return "#" + random_color_as_string;
}


let cnv = document.getElementById("oneCanvas");
let ctx = cnv.getContext("2d");

let N = 7;
let l = 10;
let x = 100;
let y = 40;

let step_colors = ["DarkKhaki", "Aquamarine", "LightBlue", "Khaki", "Orange", "RosyBrown", "Thistle", "Tomato"];

ctx.strokeStyle = "red";
ctx.lineWidth = 2;
ctx.fillStyle = "yellow";
//let arr = drawFullStairDesc(x, y, l, N, ctx, step_colors);
let arr = drawFullPiramid(x, y, l, N, ctx, step_colors);


x = arr[0] + 2 * l;
y = arr[1];
drawStairAsce(x, y, l, N, ctx);






