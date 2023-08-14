class Sprout extends BaseSprite {
    constructor(x, y) {
        super({ x: x, y: y, color: 0xff0000, speed: 0.2 });
    }

    move(deltaTime) {
        this._move(
            deltaTime,
            createVector(
                keyIsDown(RIGHT_ARROW) - keyIsDown(LEFT_ARROW),
                keyIsDown(DOWN_ARROW) - keyIsDown(UP_ARROW)
            )
        );
    }
}
