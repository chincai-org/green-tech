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
            collision_layers: ["all"],
            collision_masks: ["sprout"],
            collide_range: tileSize / 1.5
        });
    }

    _update() { }
}
