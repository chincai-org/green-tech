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
        this.add(sprite);
    }

    draw() {
        this.sprite?.draw();
    }

    _update(deltaTime) {
        this.sprite?.update(deltaTime);
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
        }
    }

    remove() {
        if (this.sprite) {
            this.sprite.tile = null;
            this.sprite = null;
        }
    }
}
