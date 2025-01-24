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
            collide_range: (tileSize / 2) * 2,
            name: "Lumberjack",
            hp: 100
        });
        this.path = [];
        this.pathfindTimer = new Timer(0);
        this.actionTimer = new Timer(1000);
        this.tickPerUpdate = 2;
        this.onPath = false;
        this.mapChanged = true;
        this.maxIdleTime = 5000;
    }

    static pathFindRange = 20;

    _tick() {
        if (this.pathfindTimer.check() && !this.onPath) {
            this.path = pathFind(
                tileSize * Lumberjack.pathFindRange,
                this,
                Tree,
                Sprout,
                Police
            );
            if (this.path.length < 1) {
                this.pathfindTimer.reset(2000);
            }
        }

        if (this.path.length > 1) {
            this.onPath = true;
            if (this.path.length == 2) {
                // target found do logic here
                this.path = [];
                this.pathfindTimer.reset(1000);
                return;
            }

            if (this.moveToTile(this.path[1])) {
                if (!this.mapChanged) {
                    this.path.shift();
                } else {
                    this.mapChanged = false;
                    this.path = pathFind(
                        tileSize * Lumberjack.pathFindRange,
                        this,
                        Tree,
                        Sprout,
                        Police
                    );
                }
            }

            if (this.idleTime > this.maxIdleTime) {
                this.onPath = false;
                this.path = [];
            }
        } else {
            this.onPath = false;
        }

        if (this.actionTimer.check()) {
            let target = this.nextToAny(Sprout, Tree, Police);
            if (target) {
                if (target instanceof Tree) {
                    // Chop tree
                    if (target.hasGrown) {
                        target.hp -= 10;
                        target.isDamaged = true;
                    }
                } else if (target instanceof Police) {
                    // Kill police
                    target.parent.spawned--;
                    target.hp -= 10;
                    target.isDamaged = true;
                } else if (target instanceof Sprout) {
                    // Push sprout
                    target.moveBy(
                        (sprout.x - this.x) * 1.5,
                        (sprout.y - this.y) * 1.5,
                        200
                    );
                }
            }
        }
    }
}
