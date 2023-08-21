class Sprout extends BaseSprite {
    constructor(x, y) {
        super({
            x,
            y,
            color: 256,
            speed: 0.2
        });
    }

    move(deltaTime) {
        let right = keyIsDown(RIGHT_ARROW) || keyIsDown(68);
        let left = keyIsDown(LEFT_ARROW) || keyIsDown(65);
        let up = keyIsDown(UP_ARROW) || keyIsDown(87);
        let down = keyIsDown(DOWN_ARROW) || keyIsDown(83);
        this._move(deltaTime, createVector(right - left, down - up));
    }

    draw() { 
        fill(this.config.color);
        circle(windowWidth / 2, windowHeight / 2, 10);

        if (displayCoord) {
            text(
                `(${Math.round(this.x)}, ${Math.round(this.y)})`,
                windowWidth / 2,
                windowHeight / 2 - 20
            );
        }
    }
}
