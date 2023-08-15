let UP;
let RIGHT;
let LEFT;
let DOWN;

class Sprout extends BaseSprite {
    constructor(x, y) {
        super({ x: (window.innerWidth/2), y: (window.innerHeight/2), color: 256, speed: 0.2 });
    }

    move(deltaTime) {
        UP = keyIsDown(UP_ARROW) || keyIsDown(87)
        RIGHT = keyIsDown(RIGHT_ARROW) || keyIsDown(68)
        LEFT = keyIsDown(LEFT_ARROW) || keyIsDown(65)
        DOWN = keyIsDown(DOWN_ARROW) || keyIsDown(83)
        this._move(
            deltaTime,
            createVector(
                (RIGHT - LEFT),
                (DOWN - UP)
            )
        );
    }
}
