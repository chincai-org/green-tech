/**
 * Sprite for acting as an obsticle, only
 * @class
 * @extends {BaseSprite}
 */
class Rock extends BaseSprite {
    constructor(x, y) {
        super({
            x,
            y,
            color: "#91a8cf",
            collision_layers: new Set(["all"]),
            collision_masks: new Set(["sprout"]),
            collide_range: tileSize / 2.1,
            name: "Rock"
        });
    }

    _tick() { }
}
