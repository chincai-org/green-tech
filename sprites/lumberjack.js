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
        this.pathfindCooldown = 0;
    }

    _update(deltaTime) {
        this.pathfindCooldown -= deltaTime;
        if (
            this.pathfindCooldown < 0
        ) {
            this.path = pathFind(200, this, Tree, Sprout);
            if (this.path.length !== 0) {
                this.pathfindCooldown = Math.sqrt((this.path[1].x * tileSize + tileSize / 2 - this.x) ** 2 +
                    (this.path[1].y * tileSize + tileSize / 2 - this.y) ** 2) / this.speed
            } else {
                // Reduce lag
                this.pathfindCooldown = 2000;
            }
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
