/**
 * Sprite for cutting treesss
 * @class
 * @extends {BaseSprite}
 */
class Lumberjack extends BaseSprite {
    constructor(x, y) {
        super({
            x,
            y,
            color: "#808080",
            speed: window.innerWidth / 30 / (window.innerWidth / 7.5)
        });
    }

    _update(deltaTime) {
        this.move(
            deltaTime,
            pathFind(this, Tree, Sprout)
            // createVector(sprout.x - this.x, sprout.y - this.y)
        );
    }
}
