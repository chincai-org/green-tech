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
            collision_layers: new Set(["lumberjack"]),
            collision_masks: new Set(["policeStation", "sprout", "police"]),
            collide_range: tileSize / 2.5
        });
        this.pathFindMaxIteration = 200;
        this.path = [];
        this.pathfindCooldown = 0;
        this.tickPerUpdate = 2;
    }

    _tick() {
        this.pathfindCooldown -= this.deltaTime();
        if (
            this.pathfindCooldown < 0
        ) {
            this.path = pathFind(this.pathFindMaxIteration, this, Tree, Sprout);
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
                // Move to center of next path
                createVector(
                    this.path[1].x * tileSize + tileSize / 2 - this.x,
                    this.path[1].y * tileSize + tileSize / 2 - this.y
                )
            );
        } else {
            this.move(
                // createVector(sprout.x - this.x, sprout.y - this.y)
                createVector(0, 0)
            );
        }
    }
}
