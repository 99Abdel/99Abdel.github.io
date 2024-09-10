
// Ball.js Copyright (c) Kari Laitinen

// http://www.naturalprogramming.com

// 2012-02-27 File created.
// 2014-02-25 Methods are added to the prototype.
// 2016-10-21 Class defined as ECMAScript 6 class.

// This program shows how JavaScript classes are defined.

// The Ball objects defined in this file are used in
// programs MovingBallOOCanvas.html and MovingBallsWithPointerCanvas.html

class Ball {
    constructor(given_center_point_x, given_center_point_y, given_color) {
        this.ball_center_point_x = given_center_point_x;
        this.ball_center_point_y = given_center_point_y;
        this.ball_color = given_color;

        this.ball_diameter = 100;

        this.ball_is_activated = false;
        this.current_direction = "";
    }

    // Next we'll specify the methods for Ball objects.

    activate_ball() {
        this.ball_is_activated = true;
    }

    deactivate_ball() {
        this.ball_is_activated = false;
    }

    get_ball_center_point_x() {
        return this.ball_center_point_x;
    }

    get_ball_center_point_y() {
        return this.ball_center_point_y;
    }

    get_ball_color() {
        return this.ball_color;
    }

    set_ball_color(new_color) {
        this.ball_color = new_color;
    }

    set_diameter(new_diameter) {
        if (new_diameter > 3) {
            this.ball_diameter = new_diameter;
        }
    }

    move_right(shift) {
        this.ball_center_point_x += shift;
    }


    move_left(shift) {
        this.ball_center_point_x -= shift;
    }

    move_up(shift) {
        this.ball_center_point_y -= shift;
    }


    move_down(shift) {
        this.ball_center_point_y += shift;
    }

    move_this_ball(movement_in_direction_x, movement_in_direction_y) {
        this.ball_center_point_x += movement_in_direction_x;
        this.ball_center_point_y += movement_in_direction_y;
    }


    move_to_position(new_center_point_x, new_center_point_y) {
        this.ball_center_point_x = new_center_point_x;
        this.ball_center_point_y = new_center_point_y;
    }


    contains_point(given_point_x, given_point_y) {
        var ball_radius = this.ball_diameter / 2;

        //  Here we use the Pythagorean theorem to calculate the distance
        //  from the given point to the center point of the ball.
        //  See the note at the end of this file.

        var distance_from_given_point_to_ball_center =

            Math.sqrt(

                Math.pow(this.ball_center_point_x - given_point_x, 2) +
                Math.pow(this.ball_center_point_y - given_point_y, 2));

        return (distance_from_given_point_to_ball_center <= ball_radius);
    }


    draw(context) {
        //  We'll first save the current drawing context so that we'll
        //  not disturb any drawing operations made by other methods.

        context.save();

        context.fillStyle = this.ball_color;

        context.beginPath();
        context.arc(this.ball_center_point_x, this.ball_center_point_y,
            this.ball_diameter / 2, 0, 2 * Math.PI, true)
        context.closePath();
        context.fill();

        if (this.ball_is_activated == true) {
            context.lineWidth = 2; // Thick edge for an activated ball.
        }

        context.stroke();   //  Draw the outline of the ball.

        context.restore();  //  Restore the saved drawing context.
    }

}  // End of the definition of the Ball class.



let ball = new Ball(300, 240, "cyan");
ball.activate_ball();
ball.current_direction = "DOWN";

let step = 20;
let clockwise = true;

document.addEventListener('keydown', function (event) {
    clockwise = clockwise ? false : true;

    if (ball.current_direction === "DOWN") {
        ball.current_direction = "UP";
    }
    else if (ball.current_direction === "UP") {
        ball.current_direction = "DOWN";
    }
    else if (ball.current_direction === "LEFT") {
        ball.current_direction = "RIGHT";
    }
    else if (ball.current_direction = "RIGHT") {
        ball.current_direction = "LEFT";
    }
});


function draw_on_canvas() {
    var canvas = document.getElementById("animation_demo_canvas");
    var context = canvas.getContext("2d");

    // We'll fill the entire canvas with light color, which overdraws
    // the previous drawings.

    context.fillStyle = "rgb( 255, 255, 210 )";  // light yellow
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (ball.ball_is_activated) {
        ball.draw(context);
        ball.deactivate_ball();
    }
    else {
        if (ball.current_direction === "DOWN") {
            if (ball.get_ball_center_point_y() < 500) {
                ball.move_down(step);
            }
            else {
                ball.current_direction = clockwise ? "LEFT" : "RIGHT";
            }
        }
        else if (ball.current_direction === "LEFT") {
            if (ball.get_ball_center_point_x() > 0) {
                ball.move_left(step);
            }
            else {
                ball.current_direction = clockwise ? "UP" : "DOWN";
            }
        }
        else if (ball.current_direction === "UP") {
            if (ball.get_ball_center_point_y() > 0) {
                ball.move_up(step);
            }
            else {
                ball.current_direction = clockwise ? "RIGHT" : "LEFT";
            }
        }
        else if (ball.current_direction === "RIGHT") {
            if (ball.get_ball_center_point_x() < 600) {
                ball.move_right(step);
            }
            else {
                ball.current_direction = clockwise ? "DOWN" : "UP";
            }
        }
        ball.activate_ball();
    }

    //  With the following method call we specify that this
    //  method "draw_on_canvas()" will be automatically called
    //  again after 1000 milliseconds, i.e., after one second.

    //  This has the effect that "draw_on_canvas()" is executed
    //  repeatedly once in every second. As the ball is 
    //  not drawn during every execution, it seems to blink
    //  on the screen.

    setTimeout("draw_on_canvas()", 10);
}


