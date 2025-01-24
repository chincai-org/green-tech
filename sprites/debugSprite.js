/**
 * Sprite for acting as an obstacle, only
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
        this.deleteTimer = new Timer(300);
    }

    _tick() {
        if (this.deleteTimer.check()) {
            sprites.splice(sprites.indexOf(this), 1);
        }
    }
}
