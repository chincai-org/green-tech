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
            collision_layers: ["tree"],
            collision_masks: ["sprout"],
            collide_range: tileSize / 2,
            image: loadImage("assets/tree.png")
        });
        this.hasGrown = false;
        this.lastUpdate = Date.now();
        this.timeToGrow = 6000;
    }

    _update() {
        let now = Date.now();

        let distance = this.distance({ x: camX, y: camY });
        let drawX = windowWidth / 2 + distance.x;
        let drawY = windowHeight / 2 + distance.y;

        if (now - this.lastUpdate > this.timeToGrow) {
            this.config.color = "#8B4513";
            this.hasGrown = true;
        } else {
            // Display time left to grow
            push();
            fill(this.config.color);
            stroke(this.config.color);
            let timeLeft = Math.round((this.timeToGrow - (now - this.lastUpdate)) / 100);
            text(
                `${timeLeft}`,
                drawX - textWidth(`${timeLeft}`) / 2,
                drawY + tileSize * 0.8
            );
            pop();
        }
    }
}
