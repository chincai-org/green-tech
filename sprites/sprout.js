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
            collision_layers: new Set(["sprout"]),
            collision_masks: new Set(["lumberjack", "tree"]),
            img: images.sprout_front,
            collide_range: (tileSize / 2) * 0.9,
            name: "Sprout",
            hp: 100,
            damage: 40
        });
        this.footstepTimer = new Timer(0);
    }
    _tick() {
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

        if (joyY > 0) {
            // going down
            this.img = images.sprout_front;
        } else if (joyY < 0) {
            this.img = images.sprout_back;
        } else if (joyX > 0) {
            this.img = images.sprout_right;
        } else if (joyX < 0) {
            this.img = images.sprout_left;
        }

        // moving
        if (Math.abs(joyY) + Math.abs(joyX) != 0) {
            if (this.footstepTimer.check()) {
                soundControl.sfxSound.play(1);
                this.footstepTimer.reset(
                    soundControl.getSoundObj(1).duration() * 1000
                );
            }
        } else {
            // stop sound maybe or shorter sfx
        }

        this.move(joyX, joyY);
        camX = Math.max(
            Math.min(this.x, gridWidth * tileSize - windowWidth / 2),
            windowWidth / 2
        );
        camY = Math.max(
            Math.min(this.y, gridHeight * tileSize - windowHeight / 2),
            windowHeight / 2
        );

        // handle animation
        if (this.animation && this.animation.time > 0) {
            this.move(
                this.animation.x,
                this.animation.y,
                this.animation.speed,
                this.animation
            );
            this.animation.time -= this.deltaTime;
        }
    }

    chopWood() {
        const currentTile = getTile(this.x, this.y);

        for (const neighbour of currentTile.neighbour()) {
            if (
                neighbour.sprite instanceof Tree &&
                neighbour.sprite.hasGrown === true &&
                resource <
                    parseInt(
                        document
                            .getElementsByClassName("progress-bar")[0]
                            .dataset.number.split("/")[1]
                    )
            ) {
                this.attack(neighbour.sprite, 100);

                resource += 5;

                return true;
            }
        }
        return false;
    }

    _takeDamage(death) {
        if (death) {
            alert("You died :(");
            resetSprites();
            resource = 50;
            this.hp = 100;
        }
    }

    draw() {
        if (this.img === null) {
            fill(this.config.color);
            circle(
                windowWidth / 2 + this.x - camX,
                windowHeight / 2 + this.y - camY,
                13 * widthRatio
            );
        } else {
            image(
                this.img,
                windowWidth / 2 + this.x - camX - tileSize / 2,
                windowHeight / 2 + this.y - camY - tileSize / 2,
                tileSize,
                tileSize
            );
        }

        if (debugMode) {
            push();
            text(
                `(${Math.round(this.x)}, ${Math.round(this.y)})`,
                windowWidth / 2 + this.x - camX,
                windowHeight / 2 + this.y - camY - 20
            );

            fill(0, 153, 255, 150);

            square(
                windowWidth / 2 + this.x - camX - this.collide_range,
                windowHeight / 2 + this.y - camY - this.collide_range,
                this.collide_range * 2
            );
            pop();
        }
    }
}
