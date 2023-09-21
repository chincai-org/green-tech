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
        if (pathFind(this, Tree, Sprout)) {
            console.log(pathFind(this, Tree, Sprout));
            this.move(deltaTime, pathFind(this, Tree, Sprout)[1]);
        } else {
            this.move(
                deltaTime,
                // createVector(sprout.x - this.x, sprout.y - this.y)
                0
            );
        }
    }
}
