/**
 * The class for the player
 * @class
 * @extends {BaseSprite}
 */
class Sprout extends BaseSprite {
    constructor(x, y) {
        super({
            x,
            y,
            color: 256,
            speed: widthRatio * 0.5,
            collision_layers: ["sprout"],
            img: "assets/sproutfront.png"
        });
    }
    move(deltaTime) {
        let right = keyIsDown(RIGHT_ARROW) || keyIsDown(68);
        let left = keyIsDown(LEFT_ARROW) || keyIsDown(65);
        let up = keyIsDown(UP_ARROW) || keyIsDown(87);
        let down = keyIsDown(DOWN_ARROW) || keyIsDown(83);
        let joyX = right - left;
        let joyY = down - up;
        let run = keyIsDown(SHIFT);
        if (run) {
            this.speed = widthRatio * 1;
        } else {
            this.speed = widthRatio * 0.5;
        }
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
        // Cheak if next step has sprite or is out of map
        if (!inBoundOfMap(x, y)) {
            return true;
        } else if (getTile(x, y).sprite) {
            return true;
        }
        return false;
    }

    chopWood() {
        const currentTile = getTile(this.x, this.y);

        for (const neighbor of findNeighbour(currentTile)) {
            if (
                tileGrid[neighbor.y][neighbor.x].sprite instanceof Tree &&
                tileGrid[neighbor.y][neighbor.x].sprite.hasGrown === true &&
                resource < parseInt(document.getElementsByClassName('bar')[0].getElementsByClassName('text')[0].innerText.split('/')[1])
            ) {
                tileGrid[neighbor.y][neighbor.x].remove();

                resource += 2;

                return true;
            }
        }
        return false;
    }

    draw() {
        if (sproutFrontImg === null) {
            fill(this.config.color);
            circle(
                windowWidth / 2 + this.x - camX,
                windowHeight / 2 + this.y - camY,
                13 * widthRatio
            );
        } else {
            image(
                sproutFrontImg,
                windowWidth / 2 + this.x - camX - tileSize / 2,
                windowHeight / 2 + this.y - camY - tileSize / 2,
                tileSize,
                tileSize
            );
        }

        if (debugMode) {
            text(
                `(${Math.round(this.x)}, ${Math.round(this.y)})`,
                windowWidth / 2 + this.x - camX,
                windowHeight / 2 + this.y - camY - 20
            );
        }
    }
}
