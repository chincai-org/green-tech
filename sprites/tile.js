/**
 * Sprite that literally acts as a tile
 * # Warning: the x and y position is the tile coordinate, not the global coordinate
 * @class
 * @extends {BaseSprite}
 */
class Tile extends BaseSprite {
    static tileWithSprite = new Set();

    constructor(x, y, sprite = null) {
        super({ x, y });

        /** @type {BaseSprite} */
        this.sprite = null;
        this.add(sprite);
    }

    draw() {
        this.sprite?.draw();
    }

    _tick() {
        this.sprite?.tick();
    }

    /**
     *
     * @param {BaseSprite} sprite - Sprite to add to this tile
     */
    add(sprite) {
        this.sprite = sprite;

        if (sprite) {
            this.sprite.tile = this;
            this.sprite.x = (this.x + 0.5) * tileSize;
            this.sprite.y = (this.y + 0.5) * tileSize;
            Tile.tileWithSprite.add(this);
        }
    }

    remove() {
        if (this.sprite) {
            Tile.tileWithSprite.delete(this);
            this.sprite.tile = null;
            this.sprite = null;
        }
    }

    onResize(changeInWidth) {
        if (this.sprite) {
            this.sprite.x = (this.x + 0.5) * tileSize;
            this.sprite.y = (this.y + 0.5) * tileSize;
            this.sprite.collide_range *= changeInWidth;
        }
    }
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {Tile}
 */
function getTile(x, y) {
    return tileGrid[Math.floor(y / tileSize)][Math.floor(x / tileSize)];
}
