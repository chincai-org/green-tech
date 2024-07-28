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
        this.name = config.name;
        this.moveObjQueue = [];
        // [vector: Vector2D, boolean: checkCollision]
        // This setup allows other sprites to move it without refrencing deltaTime
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
     * @param {Int} x - The x direction to move to
     * @param {Int} y - The y direction to move to
     */
    move(x, y) {
        this._move(x, y);

        // Update the tile
        let currTile = getTile(this.x, this.y);
        if (this.tile != currTile) {
            this.tile = getTile(this.x, this.y);
            if (this instanceof Lumberjack) {
                return;
            }
            mapChanged();
        }
    }

    draw() {
        let distance = this.distance(camX, camY);
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
            if (this instanceof DebugSprite) {
                // Do custom debugging logic here
                // check if multiple sprite in same position
                let samePos = 0;
                for (const movable of movables) {
                    if (movable.x == this.x && movable.y == this.y) {
                        samePos++;
                    }
                }
                if (samePos > 1) {
                    text(
                        `(${samePos})`,
                        drawX,
                        drawY - 2
                    );
                }
            }
            else {
                text(
                    `(${Math.round(this.x)}, ${Math.round(this.y)})`,
                    drawX,
                    drawY - 20
                );

                fill(0, 153, 255, 150);
                square(drawX - this.collide_range, drawY - this.collide_range, this.collide_range * 2);
            }
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
    }

    /**
     * @param {Vector} [vector] - The direction to move to
     * @param {Boolean} checkCollision - Check for collision when moving if then stop
     */
    _move(x, y) {
        const deltaTime = this.deltaTime();
        this.moveObjQueue.push({ x, y });
        // Handle queued up movement
        while (this.moveObjQueue.length > 0) {
            const moveObj = this.moveObjQueue.pop();
            let vectDist = Math.hypot(moveObj.x, moveObj.y);
            const newX = this.x +
                this.speed *
                deltaTime *
                (vectDist == 0 ? moveObj.x : moveObj.x / vectDist);
            const newY = this.y +
                this.speed *
                deltaTime *
                (vectDist == 0 ? moveObj.y : moveObj.y / vectDist);
            if (inBoundOfMap(newX, newY)) {
                // cliping in map
                if (this.checkCollisionInRange(this.x, this.y, this.collide_range + tileSize)) {
                    this.x = newX;
                    this.y = newY;
                    continue;
                }
                if (!this.checkCollisionInRange(newX, this.y, this.collide_range + tileSize)) {
                    this.x = newX;
                }
                if (!this.checkCollisionInRange(this.x, newY, this.collide_range + tileSize)) {
                    this.y = newY;
                }
            }

        }
    }

    /**
     *
     * @param {Int} x - The x-coordinate to calculate distance
     * @param {Int} Y - The y-coordinate to calculate distance
     * @returns {Vector}
     */
    distance(x, y) {
        return {
            x: this.x - x, y: this.y - y
        };
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
    isColliding(other, x, y, ...excluding) {
        if (anyInstance(other, excluding)) return false;
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
        for (const movable of movables) {
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
        for (const tile of Array.from(Tile.tileWithSprite)) {
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
     * Find hypothetical collision with any sprite either movables, tiled sprite
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @param {...BaseSprite} excluding - Sprites to exclude from collision check
     * @returns {BaseSprite | null} Sprite in a tile that is colliding
     */
    isCollidingAnySprite(x, y, ...excluding) {
        let collidingSprite = this.isCollidingMovables(x, y, ...excluding) ||
            this.isCollidingTileSprite(x, y, ...excluding)
        return collidingSprite;
    }


    /**
     * Find collision in a range using tile
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @param {number} range - Radius for search
     * @returns {BaseSprite} Sprite that is colliding
     */
    checkCollisionInRange(x, y, range, ...excluding) {
        const targets = findClosestTargets(x, y, range);
        for (const target of targets) {
            if (this.isColliding(target, x, y, ...excluding)) {
                return true;
            }
        }
        return false;
    }
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

/**
     * Find closest neighbour tile by searching spirarly
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @param {number} range - Radius for search
     * @param {...BaseSprite} targetClasses - Classes to target, all if empty
     * @returns {Array<BaseSprite>} Sprite sorted from distance
     */
function findClosestTargets(x, y, range, ...targetClasses) {
    const targets = findTargets(...targetClasses);

    const filteredTargets = targets.filter(target => distance(x, y, target.x, target.y) <= range);

    filteredTargets.sort((a, b) => distance(x, y, a.x, b.y) - distance(x, y, b.x, b.y));

    return filteredTargets;

}

/**
 * Find sprite that is in the targetClasses
 * @param {...Class} targetClasses  - The class that you wish to find, example: Tree
 * @returns {Array<BaseSprite>} - array of sprites corresponding to the target classes
 */
function findTargets(...targetClasses) {
    const targetSprite = [];
    if (targetClasses.length == 0) {
        for (const tile of Tile.tileWithSprite) {
            targetSprite.push(tile.sprite);
        }
        for (const movable of movables) {
            targetSprite.push(movable);
        }
        return targetSprite;
    }

    for (const tile of Tile.tileWithSprite) {
        if (anyInstance(tile.sprite, targetClasses)) {
            targetSprite.push(tile.sprite);
        }
    }
    for (const movable of movables) {
        if (anyInstance(movable, targetClasses)) {
            targetSprite.push(movable);
        }

    }
    return targetSprite;
}