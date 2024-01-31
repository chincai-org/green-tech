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
        this.collision_masks = new Set(config.collision_masks?.add("all") || ["all"]);
        this.collision_layers = new Set(config.collision_layers || []);
        this.collide_range = config.collide_range || 0;
        this.lastUpdate = Date.now();
        this.tickPerUpdate = 1;
        this.tickPassed = 0;
    }

    /**
     * Update the sprite
     * @returns {Number} Time in milliseconds since last update
     */
    deltaTime() {
        const deltaTime = Date.now() - this.lastUpdate;
        return (deltaTime > maxDeltaTime) ? 0 : deltaTime;
    }

    /**
     * Update the sprite
     */
    tick() {
        this.tickPassed++;
        if (this.tickPassed >= this.tickPerUpdate) {
            this.tickPassed = 0;
            this._tick();
            this.lastUpdate = Date.now();
        }
    }

    /**
     * @param {Vector} vector - The direction to move to
     * @param {Boolean} checkCollision - Check for collision when moving if then stop
     */
    move(vector, checkCollision = false) {
        this._move(vector, checkCollision);
    }

    draw() {
        let distance = this.distance({ x: camX, y: camY });
        let drawX = windowWidth / 2 + distance.x;
        let drawY = windowHeight / 2 + distance.y;
        if (this.img === null) {
            fill(this.config.color);
            circle(drawX, drawY, 13 * widthRatio);
        } else {
            image(this.img, drawX - tileSize / 2, drawY - tileSize / 2, tileSize, tileSize);
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
            square(drawX - this.collide_range, drawY - this.collide_range, this.collide_range * 2);
            pop();
        }
        this._draw(drawX, drawY);
    }

    _draw(drawX, drawY) {
        // Abstract function;
    }

    /**
     * Update the sprite
     */
    _tick() {
        this.move();
    }

    /**
     * @param {Vector} [vector] - The direction to move to
     * @param {Boolean} checkCollision - Check for collision when moving if then stop
     */
    _move(vector = createVector(0, 0), checkCollision = false) {
        let vectDist = Math.hypot(vector.x, vector.y);
        const newX = this.x +
            this.speed *
            this.deltaTime() *
            (vectDist > vector.x ? vector.x / vectDist : vector.x);
        const newY = this.y +
            this.speed *
            this.deltaTime() *
            (vectDist > vector.y ? vector.y / vectDist : vector.y);

        if (!checkCollision || !this.isCollidingAnySprite(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }
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
        for (let layer of other.collision_layers) {
            if (this.collision_masks.has(layer)) {
                if (this.x - this.collide_range < other.x + other.collide_range &&
                    this.x + this.collide_range > other.x - other.collide_range &&
                    this.y - this.collide_range < other.y + other.collide_range &&
                    this.y + this.collide_range > other.y - other.collide_range
                ) {
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
        for (const layer of other.collision_layers) {
            if (this.collision_masks.has(layer)) {
                if (x - this.collide_range < other.x + other.collide_range &&
                    x + this.collide_range > other.x - other.collide_range &&
                    y - this.collide_range < other.y + other.collide_range &&
                    y + this.collide_range > other.y - other.collide_range
                ) {
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
     * @param {...BaseSprite} excluding - Sprites to exclude from collision check
     * @returns {BaseSprite | null} Sprite that is colliding otherwise null
     */
    isCollidingMovables(x, y, ...excluding) {
        for (let movable of movables) {
            if (anyInstance(movable, excluding)) continue;
            if (movable !== this && this.isColliding(movable, x, y)) {
                return movable;
            }
        }
        return null;
    }

    /**
     * Find hypothetical collision with any sprite in a tile
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @param {...BaseSprite} excluding - Sprites to exclude from collision check
     * @returns {BaseSprite | null} Sprite in a tile that is colliding otherwise null
     */
    isCollidingTileSprite(x, y, ...excluding) {
        for (const tile of Tile.tileWithSprite) {
            if (tile.sprite && tile.sprite !== this) {
                if (anyInstance(tile.sprite, excluding)) continue;
                if (this.isColliding(tile.sprite, x, y)) {
                    return tile.sprite;
                }
            }
        }
        return null;
    }

    /**
     * Find hypothetical collision with any sprite either movables, tiled sprite and sprout
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @param {...BaseSprite} excluding - Sprites to exclude from collision check
     * @returns {BaseSprite | null} Sprite in a tile that is colliding
     */
    isCollidingAnySprite(x, y, ...excluding) {
        let collidingSprite = this.isCollidingMovables(x, y, ...excluding) ||
            this.isCollidingTileSprite(x, y, ...excluding) ||
            // Including sprout
            (!anyInstance(sprout, excluding) && this !== sprout && this.isColliding(sprout, x, y));
        return collidingSprite;
    }
}
