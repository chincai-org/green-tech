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
        this.actionTimer = new Timer(1000);
        this.tickPerUpdate = 2;
        this.pathFindInterval = new Timer(1000);
        this.pathFindClient = new PathFindClient(
            this,
            tileSize * Lumberjack.pathFindRange,
            Tree,
            Sprout,
            Police
        );
    }

    static pathFindRange = 30;

    _tick() {
        if (this.pathFindClient.sucess) {
            if (this.moveToTile(this.pathFindClient.pathResult[1])) {
                this.pathFindClient.request();
            }
        } else if (this.pathFindInterval.check()) {
            this.pathFindClient.request();
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
                    //target.moveBy((sprout.x - this.x) * 1.5, (sprout.y - this.y) * 1.5, 200);
                }
            }
        }
    }
}
