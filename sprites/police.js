/**
 * Sprite for catching enemies
 * @class
 * @extends {BaseSprite}
 */
class Police extends BaseSprite {
    constructor(x, y) {
        super({
            x,
            y,
            color: "#40E0D0",
            speed: widthRatio * 0.1,
            collision_layers: new Set(["police"]),
            collision_masks: new Set(["lumberjack"]),
            collide_range: tileSize / 2.5,
            name: "Police"
        });
        this.target = p5.Vector.random2D()
        this.timeIdle = 0
        this.timeNewDirection = randint(15, 50)
        this.tickPerUpdate = 2;
        this.parent = null;
    }

    _tick() {
        if (this.timeIdle > 0) {
            this.timeIdle--
            return
        }
        this.move(this.target, true);
        this.timeNewDirection--
        if (this.timeNewDirection < 1) {
            this.target = p5.Vector.random2D();
            this.timeNewDirection = randint(15, 50);
            this.timeIdle = randint(250, 500);
        }
    }
}
