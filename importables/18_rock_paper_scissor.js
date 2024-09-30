const Moves = Object.freeze({
    ROCK: 0,
    PAPER: 1,
    SCISSOR: 2
})


/**
 * class for player in the game
 */
class Player {

    constructor(name = "player1") {
        this.name = name;
        this.points = 0;
    }

    play_hand() {

    }

    get_points(){
        return this.points;
    }

    increment_points(){
        this.points++;
    }

}

/**
 * class for the game
 */
class Game {

    constructor(player) {
        this.player = player;
        this.win = false;
        this.lose = false;
        this.draw = false;
    }

    start_game() {
        
    }

    end_game() {

    }

    check_hands() {

    }

    robot_move() {

    }

    show_message(message){

    }

}