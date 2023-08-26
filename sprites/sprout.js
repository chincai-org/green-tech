class Sprout extends BaseSprite {
    constructor(x, y) {
        super({
            x,
            y,
            color: 256,
            speed: window.innerWidth / 30 / (window.innerWidth / 15)
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
        let cx = this.x;
        let cy = this.y;
        if (cx < windowWidth / 2) {
            cx = windowWidth / 2;
        } else if (this.x > gridWidth * tileSize - windowWidth / 2) {
            cx = gridWidth * tileSize - windowWidth / 2;
        }
        if (cy < windowHeight / 2) {
            cy = windowHeight / 2;
        } else if (this.y > gridHeight * tileSize - windowHeight / 2) {
            cy = gridHeight * tileSize - windowHeight / 2;
        }
        circle(
            windowWidth / 2 + this.x - cx,
            windowHeight / 2 + this.y - cy,
            10
        );

        if (displayCoord) {
            text(
                `(${Math.round(this.x)}, ${Math.round(this.y)})`,
                windowWidth / 2,
                windowHeight / 2 - 20
            );
        }
    }
}
