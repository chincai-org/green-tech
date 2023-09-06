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
        let joyX = right - left;
        let joyY = down - up;
        if (
            this.checkNextStep(this.x + this.speed * joyX * deltaTime, this.y)
        ) {
            joyX = 0;
        }
        if (
            this.checkNextStep(this.x, this.y + this.speed * joyY * deltaTime)
        ) {
            joyY = 0;
        }
        this._move(deltaTime, createVector(joyX, joyY));
        camX = Math.max(
            Math.min(this.x, gridWidth * tileSize - windowWidth / 2),
            windowWidth / 2
        );
        camY = Math.max(
            Math.min(this.y, gridHeight * tileSize - windowHeight / 2),
            windowHeight / 2
        );
    }

    checkNextStep(x, y) {
        let tile = getTile(x, y);
        if (tile.sprite) {
            return true;
        }
    }

    draw() {
        fill(this.config.color);
        circle(
            windowWidth / 2 + this.x - camX,
            windowHeight / 2 + this.y - camY,
            10
        );

        if (displayCoord) {
            text(
                `(${Math.round(this.x)}, ${Math.round(this.y)})`,
                windowWidth / 2 + this.x - camX,
                windowHeight / 2 + this.y - camY - 20
            );
        }
    }
}
