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
        let path = pathFind(this, Tree, Sprout);
        if (path.length > 0) {
            this.move(
                deltaTime,
                createVector(path[1].x - path[0].x, path[1].y - path[0].y)
            );
        } else {
            this.move(
                deltaTime,
                // createVector(sprout.x - this.x, sprout.y - this.y)
                createVector(0, 0)
            );
        }
    }
}