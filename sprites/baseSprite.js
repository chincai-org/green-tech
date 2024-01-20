/**
 * The template of every sprite
 * @class
 */
class BaseSprite {
    constructor(config) {
        this.config = config;

        this.id = config.id;
        this.x = config.x;
        this.y = config.y;
        this.hp = config.hp;
        this.damage = config.damage;
        this.speed = config.speed;
        this.cost = config.cost;
        this.tile = null;
        this.img = config.image || null;

        this.collision_masks = config.collision_masks?.concat(["all"]) || [
            "all"
        ]; // Who I can detect
        this.collision_layers = config.collision_layers || []; // Who can detect me
        this.collide_range = config.collide_range || 0;
    }

    /**
     * Update the sprite
     * @param {Number} deltaTime - Time in milliseconds since last update
     */
    update(deltaTime) {
        // console.log("update");
        this._update(deltaTime);
    }

    /**
     * @param {Number} deltaTime - Time in milliseconds since last update
     * @param {Vector} vector - The direction to move to
     */
    move(deltaTime, vector) {
        this._move(deltaTime, vector);
    }

    draw() {
        let distance = this.distance({ x: camX, y: camY });
        let drawX = windowWidth / 2 + distance.x;
        let drawY = windowHeight / 2 + distance.y;
        if (this.config.img === null || this.config.img === undefined) {
            fill(this.config.color);
            circle(drawX, drawY, 13 * widthRatio);
        } else {
            image(this.config.img, drawX - tileSize / 2, drawY - tileSize / 2, tileSize, tileSize);
        }

        if (debugMode) {
            push();
            stroke(this.config.color);
            text(
                `(${Math.round(this.x)}, ${Math.round(this.y)})`,
                drawX,
                drawY - 20
            );

            fill(0, 153, 255, 150);
            circle(drawX, drawY, this.collide_range * 2);
            pop();
        }
    }

    /**
     * Update the sprite
     * @param {Number} deltaTime - Time in milliseconds since last update
     */
    _update(deltaTime) {
        this.move(deltaTime);
    }

    /**
     * @param {Number} deltaTime - Time in milliseconds since last update
     * @param {Vector} [vector] - The direction to move to
     */
    _move(deltaTime, vector = createVector(0, 0)) {
        if (this.color == "#40E0D0") console.log(vector);
        let vectDist = Math.hypot(vector.x, vector.y);
        this.x +=
            this.speed *
            deltaTime *
            (vectDist > vector.x ? vector.x / vectDist : vector.x);
        this.y +=
            this.speed *
            deltaTime *
            (vectDist > vector.y ? vector.y / vectDist : vector.y);
    }

    /**
     *
     * @param {BaseSprite} other
     * @returns {Vector}
     */
    distance(other) {
        return createVector(this.x - other.x, this.y - other.y);
    }

    /**
     *
     * @param {BaseSprite} other - Another sprite to detect collision
     * @returns {Boolean}
     */
    collide(other) {
        this._collide(other);
    }

    /**
     *
     * @param {BaseSprite} other - Another sprite to detect collision
     * @returns {Boolean}
     */
    _collide(other) {
        for (let mask of this.collision_masks) {
            if (other.collision_layers.includes(mask)) {
                let dist = this.distance(other);
                if (dist.mag() < this.collide_range + other.collide_range) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Find hypothetical collision with another sprite
     * @param {BaseSprite} other - Another sprite to detect collision
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @returns {Boolean}
     */
    isColliding(other, x, y) {
        for (let mask of this.collision_masks) {
            if (other.collision_layers.includes(mask)) {
                let dist = createVector(x - other.x, y - other.y);
                if (dist.mag() < this.collide_range + other.collide_range) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Find hypothetical collision with any movables
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @returns {BaseSprite} Sprite that is colliding otherwise null
     */
    isCollidingMovables(x, y) {
        for (let movable of movables) {
            if (movable != this && this.isColliding(movable, x, y)) {
                return movable;
            }
        }
        return null;
    }

    /**
     * Find hypothetical collision with any sprite in a tile
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @returns {BaseSprite} Sprite in a tile that is colliding otherwise null
     */
    isCollidingTileSprite(x, y) {
        for (let row of tileGrid) {
            for (let tile of row) {
                if (tile.sprite && tile.sprite != this && this.isColliding(tile.sprite, x, y)) {
                    return tile.sprite;
                }
            }
        }

        return null;
    }

    /**
     * Find hypothetical collision with any sprite either movables or tiled sprite
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @returns {BaseSprite} Sprite in a tile that is colliding
     */
    isCollidingAnySprite(x, y) {
        let collidingSprite = this.isCollidingMovables(x, y) ||
            this.isCollidingTileSprite(x, y) ||
            // Including sprout
            (this !== sprout && this.isColliding(sprout, x, y));
        return collidingSprite;
    }
}
