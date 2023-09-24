/**
 * Sprite for cutting trees
 * @class
 * @extends {BaseSprite}
 */
class Lumberjack extends BaseSprite {
    constructor(x, y) {
        super({
            x,
            y,
            color: "#808080",
            speed: widthRatio * 0.25,
            collision_layers: ["lumberjack"],
            collision_masks: ["policeStation", "sprout"],
            collide_range: tileSize / 2
        });
        this.path = [];
    }

    _update(deltaTime) {
        // Cheak if reach next path within certain range
        // BUG: path finder get stuck if withinRangeOf is too low
        const withinRangeOf = tileSize / 1.5;
        if (
            this.path.length === 0 ||
            (Math.abs(this.x - this.path[1].x * tileSize) < withinRangeOf &&
                Math.abs(this.y - this.path[1].y * tileSize) < withinRangeOf)
        ) {
            this.path = pathFind(this, Tree, Sprout);
        }
        if (this.path.length > 0) {
            this.move(
                deltaTime,
                // Move to center of next path
                createVector(
                    this.path[1].x * tileSize + tileSize / 2 - this.x,
                    this.path[1].y * tileSize + tileSize / 2 - this.y
                )
            );
        } else {
            this.move(
                deltaTime,
                // createVector(sprout.x - this.x, sprout.y - this.y)
                createVector(0, 0)
            );
        }
    }
}
