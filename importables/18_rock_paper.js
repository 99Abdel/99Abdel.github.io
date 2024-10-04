const Moves = Object.freeze({
    ROCK: 0,
    PAPER: 1,
    S: 2
})

/**
 * move chosen by the player
 */
class Hand {

    constructor(move, overpowered_move) {
        this.move = move;
        this.overpowered_move = overpowered_move;
    }

    get_move() {
        return this.move;
    }

    set_move(move) {
        this.move = move;
    }

    get_overpowered_move() {
        return this.overpowered_move;
    }

    set_overpowered_move(overpowered_move) {
        this.overpowered_move = overpowered_move;
    }

    /**
     * compares two moves and returns the result
     * 1 win, 0 draw, -1 lost. 
     * @param {int} other_move 
     * @returns {int} case
     */
    compare(other_move) {
        if (this.overpowered_move == other_move) {
            return 1;
        }
        else if (this.move == other_move) {
            return 0;
        }
        return -1;
    }

}


/**
 * class for player in the game
 */
class Player {

    constructor(name = "player1") {
        this.name = name;
        this.points = 0;
        this.hand = new Hand();
    }

    get_name() {
        return this.name;
    }

    get_points() {
        return this.points;
    }

    set_points(points) {
        this.points = points;
    }

    increment_points() {
        this.points++;
    }

    reset_points() {
        this.points = 0;
    }

    play_hand(choice) {
        switch (choice) {
            case 0:
                this.hand = new Hand(Moves.ROCK, Moves.S);
                break;
            case 1:
                this.hand = new Hand(Moves.PAPER, Moves.ROCK);
                break;
            case 2:
                this.hand = new Hand(Moves.S, Moves.PAPER);
                break;
        }
    }
}

/**
 * class for the game
 */
class Game {

    constructor(max_points = 3) {
        this.player1;
        this.player2;
        this.message;
        this.game_over;
        this.MAX_POINTS = max_points;
    }

    get_message() {
        return this.message;
    }

    set_message(message) {
        this.message = message;
    }

    get_game_over() {
        return this.game_over;
    }

    start_game(name1 = "Human", name2 = "PC") {
        this.game_over = false;
        this.player1 = new Player(name1);
        this.player2 = new Player(name2);
        this.set_message("the game has started");
        this.show_message();
        // the start game is clicked then make the initial page disappear and show finally the choice hands
    }


    play_round(move1, move2) {
        this.player1.play_hand(move1);
        this.player2.play_hand(move2);

        // move the icons do animations with a function
    }

    check_hands() {
        let result = this.player1.hand.compare(this.player2.hand.get_move());
        if (result === 1) {
            this.player1.increment_points();
            this.set_message(this.player1.get_name() + "Winning Hand!");
        }
        else if (result === 0) {
            this.set_message("Draw Hand!");
        }
        else if (result === -1) {
            this.player2.increment_points();
            this.set_message(this.player2.get_name() + "Winning Hand!");
        }

        this.show_message();
    }

    check_win() {
        if (this.player1.get_points() >= this.MAX_POINTS) {
            this.set_message(this.player1.get_name() + " Has Won. The game is over");
            this.end_game();
        }
        else if (this.player2.get_points() >= this.MAX_POINTS) {
            this.set_message(this.player2.get_name() + " Has Won. The game is over");
            this.end_game();
        }

        this.show_message();
    }

    end_game() {
        this.player1.reset_points();
        this.player2.reset_points();
        this.game_over = true;
        // add fading background 
        // go show button go to initial page or restart game
    }

    show_message() {
        console.log(this.message);
        // document.getElem .... = this.mnessage
        // show message gradually like smooth action.
    }

}

// -------------------------------------------------------------------------------
// ---------------------------- GRAPHIC SECTION ----------------------------------
// -------------------------------------------------------------------------------

/**
 * if (?) button is clicked show a popup with the rules already contained in the html but it is hidden.
 */
function show_game_instructions() {
    document.body.style.pointerEvents = "none";
    document.getElementById("help_popup").style.display = "block";
}

/**
 * if i click close button make it disappear in the popup window.
 */
function hide_game_instructions() {
    document.body.style.pointerEvents = "auto";
    document.getElementById("help_popup").style.display = "none";
}

/**
 * setup initial page with a bluish background instructions at top right
 * big initial game button.
 */
function show_initial_page() {
    visibility_page_divs("setup_divs", "none");
    visibility_page_divs("game_page_divs", "none");
    visibility_page_divs("final_page_divs", "none");
    visibility_page_divs("main_page_divs", "flex");
}

/**
 * choose if to play against a player or PC, the Player mode is not clickable.
 * Then insert the player name call after the start_game function.
 */
function show_mode_page() {
    visibility_page_divs("main_page_divs", "none");
    visibility_page_divs("setup_divs", "flex");
}

/**
 * this is the page with the 3 choices on bottom
 */
function show_game_page() {
    visibility_page_divs("setup_divs", "none");
    visibility_page_divs("game_page_divs", "flex");
    //document.getElementById("pc").style.opacity = "0.0";
}

/**
 * animation of the selected move
 */
function animation1(dict) {

    let xb = dict[0];
    let yb = dict[1];
    let elem = dict[2];
    let thread_idx = dict[3];

    let x = parseFloat(elem.style.right);
    let y = parseFloat(elem.style.top);

    let step_y = 1;
    let step_x = 1;
    let diff_x = Math.abs(Math.abs(xb) - Math.abs(x));
    let diff_y = Math.abs(Math.abs(yb) - Math.abs(y));

    if (diff_x > 0) {
        x = (xb < x) ? x - step_x : x + step_x;
        elem.style.right = x + "vmin";
    }
    if (diff_y > 0) {
        y = (yb < y) ? y - step_y : y + step_y;
        elem.style.top = y + "vmin";
    }

    if (diff_x <= 0 && diff_y <= 0) {
        clearInterval(thread_ID[thread_idx]);
        checkAllThreadsCompleted(dict);
    }
}

/**
 * animation of the unselected moves (fade)
 */
function animation2(dict) {

    let elem = dict[2];
    let thread_idx = dict[3];
    let opacity = parseFloat(elem.style.opacity);

    if (opacity > 0) {
        elem.style.opacity = opacity - 0.1 + "";
    }
    else {
        clearInterval(thread_ID[thread_idx]);
        checkAllThreadsCompleted(dict);
    }
}

/**
 * animation of the unselected moves (antifade)
 */
function animation3(dict) {

    let elem = dict[2];
    let thread_idx = dict[3];
    let opacity = parseFloat(elem.style.opacity);

    if (opacity < 1) {
        elem.style.opacity = opacity + 0.1 + "";
    }
    else {
        clearInterval(thread_ID[thread_idx]);
        checkAllThreadsCompleted(dict);
    }
}

/**
 * Controlla se tutti i thread sono completati e stampa il messaggio
 */
function checkAllThreadsCompleted(dict) {
    active_threads--; // Decrementa il contatore dei thread attivi

    if (active_threads === 0) {
        if (second_phase) {
            second_phase = false;
        }
        else {
            setTimeout(go_to_home_pos, 1000);
            second_phase = true;
        }
    }

}

function go_to_home_pos() {
    let timeout = 25;
    let dict;
    let dx = 0, dy = 0;
    let array = document.getElementsByClassName("rps");
    let pc_elem = document.getElementById("pc_move");
    active_threads = array.length + 2;

    for (let i = 0; i < array.length; i++) {
        dict = [dx, dy, array[i], i];

        if (array[i].id === selected_move.id) {
            thread_ID[i] = setInterval(animation1, timeout, dict);
            dict = [dx, dy, pc_elem, 3];
            thread_ID[3] = setInterval(animation1, timeout, dict);
            dict = [dx, dy, pc_elem, 4];
            thread_ID[4] = setInterval(animation2, timeout, dict)
        }
        else {
            thread_ID[i] = setInterval(animation3, timeout, dict);
        }
    }
}

/**
 * moves around the icons
 */
function show_animation_round() {
    active_threads = thread_ID.length;
    second_phase = false;
    let timeout = 25;
    let dict;
    let dx, dy = -20;
    let array = this.parentElement.getElementsByClassName("rps");
    let pc_elem = document.getElementById("pc_move");
    selected_move = this;

    switch (this.id) {
        case "r":
            dx = -18;
            break;
        case "p":
            dx = 0;
            break;
        case "s":
            dx = 18;
            break;
    }

    for (let i = 0; i < array.length; i++) {
        array[i].style.pointerEvents = "none";
        dict = [dx, dy, array[i], i];

        if (array[i].id === this.id) {
            thread_ID[i] = setInterval(animation1, timeout, dict);
            dict = [0, 20, pc_elem, 3];
            thread_ID[3] = setInterval(animation1, timeout, dict);
            dict = [0, 20, pc_elem, 4];
            thread_ID[4] = setInterval(animation3, timeout, dict);
        }
        else {
            thread_ID[i] = setInterval(animation2, timeout, dict);
        }
    }
}

function show_final_page() {
    // containes message who won
    // and restart button
    // and go to initial page
}

function visibility_page_divs(page, mode) {
    let divs = document.getElementsByClassName(page);
    for (let i = 0; i < divs.length; i++) {
        divs[i].style.display = mode;
    }
}



let game = new Game();

document.body.onload = show_initial_page();
document.getElementById("help_button").addEventListener("click", show_game_instructions);
document.getElementById("close_popup").addEventListener("click", hide_game_instructions);
document.getElementById("start_button").addEventListener("click", show_mode_page);
document.getElementById("start_game_button").addEventListener("click", show_game_page);
document.getElementById("exit_game_button").addEventListener("click", show_initial_page);

let moves = document.getElementsByClassName("rps");
let pc_move = document.getElementById("pc_move");
pc_move.style.top = "0vmin";
pc_move.style.right = "0vmin";
pc_move.style.opacity = "0.0";

for (let i = 0; i < moves.length; i++) {
    moves[i].addEventListener("mousedown", show_animation_round);
    moves[i].style.top = "0vmin";
    moves[i].style.right = "0vmin";
    moves[i].style.opacity = "1.0";
}


let active_threads = 0;
let second_phase = false;
let thread_ID = [null, null, null, null, null];
let selected_move;

/*


let i = 0;

game.start_game("pippo"); // get this from the button

while(!game.get_game_over() && i != 1){
    
    //let player_move = parseInt(prompt("- 0 ROCK\n- 1 PAPER\n- 2 S")); // get the value from the pushed icon
    let pc_move = Math.floor(Math.random()*3); // this will remain the same

    game.play_round(player_move, pc_move);
    game.check_hands();
    game.check_win();

    i = 1 === parseInt(prompt("do you want to exit: 1 yes")) ? 1 : 0; // get the exit value from the button

}
*/