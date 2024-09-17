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
            collide_range: tileSize / 2.5,
            name: "Lumberjack"
        });
        this.path = [];
        this.pathfindCooldown = 0;
        this.actionCooldown = 1000;
        this.tickPerUpdate = 2;
        this.onPath = false;
        this.mapChanged = true;
        this.maxIdleTime = 5000;
    }


    _tick() {
        this.pathfindCooldown -= this.deltaTime;
        this.actionCooldown -= this.deltaTime;

        if (this.pathfindCooldown < 0 && !this.onPath) {
            this.path = pathFind(tileSize * 20, this, Tree, Sprout, Police);
            if (this.path.length < 1) {
                this.pathfindCooldown = 2000;
            }
        }


        if (this.path.length > 1) {
            this.onPath = true;
            if (this.path.length == 2) {
                // target found do logic here
                this.path = [];
                this.pathfindCooldown = 1000;
                return;
            }

            if (this.moveToTile(this.path[1].x, this.path[1].y)) {
                if (!this.mapChanged) {
                    this.path.shift();
                }
                else {
                    this.mapChanged = false;
                    this.path = pathFind(tileSize * 20, this, Tree, Sprout, Police);
                }
            }

            if (this.idleTime > this.maxIdleTime) {
                this.onPath = false;
                this.path = [];
            }
        }
        else {
            this.onPath = false;
        }

        if (this.actionCooldown < 0) {
            let tryFindTarget = this.findRangedTargetsSorted(tileSize * 2, Sprout, Tree, Police);
            if (tryFindTarget.length > 0) {
                const target = tryFindTarget[0];
                if (target instanceof Tree) {
                    // Chop tree
                    if (target.hasGrown) {
                        unappendSprite(target);
                    }
                }
                else if (target instanceof Police) {
                    // Kill police
                    target.parent.spawned--;
                    unappendSprite(target);
                }
                else if (target instanceof Sprout) {
                    // Push sprout
                    target.moveBy((sprout.x - this.x) * 1.5, (sprout.y - this.y) * 1.5, 200);
                }
            }
            this.actionCooldown = 1000;
        }
    }
}
