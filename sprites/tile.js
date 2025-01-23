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
        this.occupied = [];
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
        };
    }

    /**
     * @param {boolean} diagonal - allow diagonal? default is true
     * @returns {Array<Vector>} - all the neighbour of the tile
     */
    neighbour(diagonal = true) {
        const result = [];

        // guarentees valid tile
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                if (!diagonal && Math.abs(dx) + Math.abs(dy) == 2) continue;
                const neighbour = { x: this.x + dx, y: this.y + dy };
                if (inBoundOfGrid(neighbour.x, neighbour.y)) {
                    result.push(tileGrid[neighbour.y][neighbour.x]);
                }
            }
        }

        return result;
    }

    doubleNeighbour() {
        const result = [];

        // guarentees valid tile
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                if (dx === 0 && dy === 0) continue;
                const neighbour = { x: this.x + dx, y: this.y + dy };
                if (inBoundOfGrid(neighbour.x, neighbour.y)) {
                    result.push(tileGrid[neighbour.y][neighbour.x]);
                }
            }
        }

        return result;
    }
}

function centerFromCoord(x, y) {
    return {
        x: (x + 0.5) * tileSize,
        y: (y + 0.5) * tileSize
    };
}

/**
 *
 * @param {number} x
 * @param {number} y
 * Guarentees tile is valid
 * @returns {Tile}
 */
function getTile(x, y) {
    let tileX = Math.floor(x / tileSize);
    let tileY = Math.floor(y / tileSize);
    if (tileX < 0) {
        tileX = 0;
    } else if (tileX > gridWidth) {
        tileX = gridWidth;
    }
    if (tileY < 0) {
        tileY = 0;
    } else if (tileY > gridHeight) {
        tileY = gridHeight;
    }
    return tileGrid[tileY][tileX];
}
