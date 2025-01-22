/**
 * Sprite for acting as an obsticle, only
 * @class
 * @extends {BaseSprite}
 */
class DebugSprite extends BaseSprite {
    constructor(x, y) {
        super({
            x,
            y,
            color: "#aaa8cf",
            collision_layers: new Set([""]),
            collision_masks: new Set([""]),
            collide_range: tileSize / 2,
            name: "debugSprite"
        });
        this.timePlaced = Date.now();
    }

    _tick() {
        if (Date.now() - this.timePlaced > 220) {
            unappendSprite(this);
        }
    }
}
