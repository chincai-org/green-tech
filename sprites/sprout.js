class Sprout extends BaseSprite {
    constructor(x, y) {
        super({ x: (window.innerWidth/2), y: (window.innerHeight/2), color: 256, speed: 0.2 });
    }

    move(deltaTime) {
        let up = keyIsDown(UP_ARROW) || keyIsDown(87);
        let right = keyIsDown(RIGHT_ARROW) || keyIsDown(68);
        let left = keyIsDown(LEFT_ARROW) || keyIsDown(65);
        let down = keyIsDown(DOWN_ARROW) || keyIsDown(83);
        this._move(
            deltaTime,
            createVector(
                (right - left),
                (down - up)
            )
        );
    }
}
