/**
 * Sprite that literally acts as a tile
 * # Warning: the x and y position is the tile coordinate, not the global coordinate
 * @class
 * @extends {BaseSprite}
 */
class Tile extends BaseSprite {
    constructor(x, y, sprite = null) {
        super({ x, y });

        /** @type {BaseSprite} */
        this.sprite = null;
    }

    /**
     *
     * @param {BaseSprite} sprite - Sprite to add to this tile
     */
    add(sprite) {
        this.sprite = sprite;

        if (sprite) {
            this.sprite.tile = this;
            this.sprite.onTile = true;
        }
    }

    remove() {
        if (this.sprite) {
            this.sprite = null;
        }
    }

    center() {
        return {
            x: (this.x + 0.5) * tileSize,
            y: (this.y + 0.5) * tileSize
        }
    }

}

function centerFromCoord(x, y) {
    return {
        x: (x + 0.5) * tileSize,
        y: (y + 0.5) * tileSize
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
