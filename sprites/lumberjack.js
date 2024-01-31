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
            collision_masks: new Set(["policeStation", "police", "sprout"]),
            collide_range: tileSize / 2.5
        });
        this.pathFindMaxIteration = 200;
        this.path = [];
        this.pathfindCooldown = 0;
        this.tickPerUpdate = 2;
    }

    _tick() {
        const old = this.x;
        this.pathfindCooldown -= this.deltaTime();

        if (
            this.pathfindCooldown < 0
        ) {
            this.path = pathFind(this.pathFindMaxIteration, this, Tree, Sprout);
            if (this.path.length !== 0) {
                this.pathfindCooldown = Math.sqrt((this.path[1].x * tileSize + tileSize / 2 - this.x) ** 2 +
                    (this.path[1].y * tileSize + tileSize / 2 - this.y) ** 2) / this.speed
            }
        }

        if (this.path.length > 0) {
            if (this.path.length == 2) {
                // target found do logic here
                this.path = [];
                this.pathfindCooldown = 1000;
                return;
            }

            this.move(
                // Move to center of next path
                createVector(
                    this.path[1].x * tileSize + tileSize / 2 - this.x,
                    this.path[1].y * tileSize + tileSize / 2 - this.y
                ),
                true
            );
        }
    }
}
