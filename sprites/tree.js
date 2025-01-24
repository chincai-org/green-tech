/**
 * Sprite for decreasing pollution level
 * @class
 * @extends {BaseSprite}
 */
class Tree extends BaseSprite {
    constructor(x, y) {
        super({
            x,
            y,
            color: "#00ff00",
            collision_layers: new Set(["tree"]),
            collision_masks: new Set(["sprout", "lumberjack"]),
            collide_range: tileSize / 2,
            img: loadImage("assets/img/tree.png"),
            name: "Tree",
            hp: 100
        });
        this.timePlaced = Date.now();
        this.hasGrown = false;
        this.timeToGrow = 6000;
        this.tickPerUpdate = 4;
    }

    _tick() {
        if (Date.now() - this.timePlaced > this.timeToGrow && !this.hasGrown) {
            this.grow();
        }

        if (this.hp <= 0) {
            unappendSprite(this);
        }
    }

    _draw(drawX, drawY) {
        if (this.hasGrown == false) {
            virtualEdit(() => {
                // Display time left to grow
                fill(this.config.color);
                stroke(this.config.color);
                let timeLeft = Math.round(
                    (this.timeToGrow - (Date.now() - this.timePlaced)) / 100
                );
                text(
                    `${timeLeft}`,
                    drawX - textWidth(`${timeLeft}`) / 2,
                    drawY + tileSize * 0.8
                );
            });
        }
    }

    grow() {
        this.config.color = "#8B4513";
        this.hasGrown = true;

        polluteRate -= 0.1;
    }
}
