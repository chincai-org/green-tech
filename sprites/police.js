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
            speed: 0.1,
            collision_layers: ["police"],
            collision_masks: ["lumberjack"],
            collide_range: tileSize / 2.5
        });
        this.target = p5.Vector.random2D()
        this.timeIdle = 0
        this.timeNewDirection = randint(15, 50)
    }

    _update(deltaTime) {
        if (this.timeIdle > 0) {
            this.timeIdle--
            return
        }
        this.move(deltaTime, this.target);
        this.timeNewDirection--
        if (this.timeNewDirection < 1) {
            this.target = p5.Vector.random2D();
            this.timeNewDirection = randint(15, 50)
            this.timeIdle = randint(250, 500);
        }
        if (this.timeNewDirection < 200 && this.isCollidingAnySprite(this.x, this.y)) {
            this.target.mult(-1);
        }
    }
}
