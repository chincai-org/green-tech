/**
 * Sprite for cutting trees
 * @class
 * @extends {BaseSprite}
 */
class Lumberjack extends BaseSprite {
    static lumberjackCount = 0;
    static allLumberjackMaxIteration = 400;
    constructor(x, y) {
        super({
            x,
            y,
            color: "#808080",
            speed: widthRatio * 0.25,
            collision_layers: new Set(["lumberjack"]),
            collision_masks: new Set(["policeStation", "police", "sprout"]),
            collide_range: tileSize / 2.5,
            name: "Lumberjack"
        });
        this.path = [];
        this.pathfindCooldown = 0;
        this.actionCooldown = 500;
        this.tickPerUpdate = 2;
        Lumberjack.lumberjackCount++;
    }


    _tick() {
        this.pathfindCooldown -= this.deltaTime();
        this.actionCooldown -= this.deltaTime();

        if (this.pathfindCooldown < 0) {
            let maxIteration = Lumberjack.allLumberjackMaxIteration / Lumberjack.lumberjackCount;
            this.path = pathFind(maxIteration, 3, 30, this, Tree, Sprout, Police);
            if (this.path.length !== 0) {
                this.pathfindCooldown = Math.sqrt((this.path[1].x * tileSize + tileSize / 2 - this.x) ** 2 +
                    (this.path[1].y * tileSize + tileSize / 2 - this.y) ** 2) / this.speed
            }
            else {
                this.pathfindCooldown = 500;
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

        if (this.actionCooldown < 0) {
            let tryFindTarget = this.findClosestNeighbourUsingTile(this.x, this.y, 1, Sprout, Tree, Police);
            if (tryFindTarget.length > 0) {
                const target = tryFindTarget[0];
                if (target instanceof Tree && Tile.tileWithSprite.has(target.tile)) {
                    // Chop tree
                    if (target.hasGrown) {
                        target.tile.remove();
                    }
                }
                else if (target instanceof Police) {
                    // Kill police
                    target.parent.spawned--;
                    unappendMovable(target);
                }
                else if (target instanceof Sprout) {
                    // Push sprout
                    sprout.moveObjQueue.push({ vector: createVector(sprout.x - this.x, sprout.y - this.y), checkCollision: true })
                }
            }
            this.actionCooldown = 2000;
        }
    }
}
