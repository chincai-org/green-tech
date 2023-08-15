const UP = keyIsDown(UP_ARROW) || keyIsDown(87)
const RIGHT = keyIsDown(RIGHT_ARROW) || keyIsDown(68)
const LEFT = keyIsDown(LEFT_ARROW) || keyIsDown(65)
const DOWN = keyIsDown(DOWN_ARROW) || keyIsDown(83)

class Sprout extends BaseSprite {
    constructor(x, y) {
        super({ x: (window.innerWidth/2), y: (window.innerHeight/2), color: 256, speed: 0.2 });
    }

    move(deltaTime) {
        this._move(
            deltaTime,
            createVector(
                (RIGHT - LEFT,
                DOWN - UP)
            )
        );
    }
}
