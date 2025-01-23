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
        this.collision_masks = new Set(
            config.collision_masks?.add("all") || ["all"]
        );
        this.collision_layers = new Set(config.collision_layers || []);
        this.collide_range = config.collide_range || 0;
        this.lastUpdate = Date.now();
        this.tickPerUpdate = 1;
        this.tickPassed = 0;
        this.name = config.name;
        this.animation = { x: 0, y: 0, speed: 0, time: 0 };
        this.deltaTime = 0;
        this.idleTime = 0;
        this.onTile = false;
        this.isDamaged = config.isDamaged || false;
        this.lastMapUpdatePos = { x: this.x, y: this.y };
    }

    static _ref = null;

    static ref() {
        if (!BaseSprite._ref) {
            BaseSprite._ref = new this(0, 0);
            refrences.push(BaseSprite._ref);
        }
        return BaseSprite._ref;
    }

    /**
     * Update the sprite
     */
    tick() {
        this.tickPassed++;
        if (this.tickPassed >= this.tickPerUpdate) {
            this.tickPassed = 0;
            const deltaTime = Date.now() - this.lastUpdate;
            if (deltaTime < maxDeltaTime) {
                this.deltaTime = deltaTime;
            } else {
                this.deltaTime = 0;
            }
            const lastX = this.x;
            const lastY = this.y;
            this._tick();
            if (lastX == this.x && lastY == this.y) {
                this.idleTime += deltaTime;
            } else {
                this.idleTime = 0;
            }
            this.lastUpdate = Date.now();
        }
    }

    /**
     * @param {number} x - The x direction to move to
     * @param {number} y - The y direction to move to
     */
    move(x, y, speed = this.speed) {
        this._move(x, y, speed);
    }

    moveBy(x, y, t) {
        let distance = Math.hypot(x, y);
        let speed = distance / t;
        this.animation = { x: x, y: y, speed: speed, time: t };
    }

    moveTo(x, y) {
        if (this.distance(x, y) < tileSize / 4) {
            return true;
        } else {
            this._move(x - this.x, y - this.y, this.speed);
            return false;
        }
    }

    moveToTile(tile) {
        return this.moveTo(
            tile.x * tileSize + tileSize / 2,
            tile.y * tileSize + tileSize / 2
        );
    }

    checkMapChange(forced = false, deleted = false) {
        let currTile = getTile(this.x, this.y);
        let oldTile = this.tile;
        let oldPos = this.lastMapUpdatePos;
        if (oldTile != currTile || forced) {
            // Update occupied by looping through rectangle
            this.tile = currTile;
            this.lastMapUpdatePos = { x: this.x, y: this.y };
            let oldFirstTile = getTile(
                oldPos.x - this.collide_range,
                oldPos.y - this.collide_range
            );
            let oldLastTile = getTile(
                oldPos.x + this.collide_range,
                oldPos.y + this.collide_range
            );
            // Remove from old
            for (let i = oldFirstTile.x; i <= oldLastTile.x; i++) {
                for (let j = oldFirstTile.y; j <= oldLastTile.y; j++) {
                    tileGrid[j][i].occupied.splice(
                        tileGrid[j][i].occupied.indexOf(this),
                        1
                    );
                }
            }

            // When unappend sprite dont need to push
            if (!deleted) {
                let lastTile = getTile(
                    this.x + this.collide_range,
                    this.y + this.collide_range
                );
                let firstTile = getTile(
                    this.x - this.collide_range,
                    this.y - this.collide_range
                );

                for (let i = firstTile.x; i <= lastTile.x; i++) {
                    for (let j = firstTile.y; j <= lastTile.y; j++) {
                        tileGrid[j][i].occupied.push(this);
                    }
                }
            }

            // Notify map changed
            mapChanged();
        }
    }

    draw() {
        let distanceVec = this.distanceVec(camX, camY);
        let drawX = windowWidth / 2 + distanceVec.x;
        let drawY = windowHeight / 2 + distanceVec.y;
        if (this.img === null) {
            fill(this.config.color);
            circle(drawX, drawY, 13 * widthRatio);
        } else {
            image(
                this.img,
                drawX - tileSize / 2,
                drawY - tileSize / 2,
                tileSize,
                tileSize
            );
        }
        if (this.hp >= 0 && this.isDamaged) {
            fill(this.config.color);
            stroke(this.config.color);
            text(
                `${this.hp}`,
                drawX - textWidth(`${this.hp}`) / 2,
                drawY + tileSize * 0.8
            );
        }

        if (debugMode) {
            push();
            stroke(this.config.color);
            if (this instanceof DebugSprite) {
                // Do custom debugging logic here
                // check if multiple sprite in same position
                let samePos = 0;
                for (const sprite of sprites) {
                    if (sprite.x == this.x && sprite.y == this.y) {
                        samePos++;
                    }
                }
                if (samePos > 1) {
                    text(`(${samePos})`, drawX, drawY - 2);
                }
            } else {
                text(
                    `(${Math.round(this.x)}, ${Math.round(this.y)})`,
                    drawX,
                    drawY - 20
                );

                fill(0, 153, 255, 150);
                square(
                    drawX - this.collide_range,
                    drawY - this.collide_range,
                    this.collide_range * 2
                );
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
        // handle animation
        if (this.animation.time > 0) {
            this.move(
                this.animation.x,
                this.animation.y,
                this.animation.speed,
                this.animation
            );
            this.animation.time -= this.deltaTime;
        }
    }

    /**
     * @param {number} x - The x direction to move to
     * @param {number} y - The y direction to move to
     * @param {boolean} checkCollision - Check for collision when moving if then stop
     */
    _move(x, y, speed) {
        // Handle queued up movement
        let vectDist = Math.hypot(x, y);
        const newX =
            this.x +
            speed * this.deltaTime * (vectDist == 0 ? x : x / vectDist);
        const newY =
            this.y +
            speed * this.deltaTime * (vectDist == 0 ? y : y / vectDist);
        if (inBoundOfMap(newX, newY)) {
            // cliping in map
            if (this.isCollidingUsingTile(this.x, this.y)) {
                this.x = newX;
                this.y = newY;
            }
            if (!this.isCollidingUsingTile(newX, this.y)) {
                this.x = newX;
            }
            if (!this.isCollidingUsingTile(this.x, newY)) {
                this.y = newY;
            }
        }

        this.checkMapChange();
    }

    /**
     * Find distance from current sprite in vector
     * @param {number} x
     * @param {number} y
     * @returns {Vector}
     */
    distanceVec(x, y) {
        return {
            x: this.x - x,
            y: this.y - y
        };
    }

    /**
     * Find diagonal distance from current sprite
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    distance(x, y) {
        return Math.hypot(this.x - x, this.y - y);
    }

    /**
     *
     * @param {BaseSprite} other - Another sprite to detect collision
     * @returns {boolean}
     */
    collide(other) {
        this._collide(other);
    }

    /**
     *
     * @param {BaseSprite} other - Another sprite to detect collision
     * @returns {boolean}
     */
    _collide(other) {
        for (let layer of other.collision_layers) {
            if (this.collision_masks.has(layer)) {
                if (
                    this.x - this.collide_range <
                        other.x + other.collide_range &&
                    this.x + this.collide_range >
                        other.x - other.collide_range &&
                    this.y - this.collide_range <
                        other.y + other.collide_range &&
                    this.y + this.collide_range > other.y - other.collide_range
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Use tile to check
     * @param {BaseSprite} other - Another sprite to detect overlap
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @returns {boolean}
     */
    nextToAny(...targetClasses) {
        for (const neighbour of this.tile.doubleNeighbour()) {
            for (const target of neighbour.occupied) {
                let neighbourCenter = neighbour.center();
                if (
                    anyInstance(target, targetClasses) &&
                    this.overlap(target, neighbourCenter.x, neighbourCenter.y)
                ) {
                    return target;
                }
            }
        }
        return null;
    }

    /**
     * Check whether two collision box overlap
     * @param {BaseSprite} other - Another sprite to detect overlap
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @returns {boolean}
     */
    overlap(other, x, y) {
        if (
            x - this.collide_range < other.x + other.collide_range &&
            x + this.collide_range > other.x - other.collide_range &&
            y - this.collide_range < other.y + other.collide_range &&
            y + this.collide_range > other.y - other.collide_range
        ) {
            return true;
        }
    }

    /**
     * Find hypothetical collision with another sprite
     * @param {BaseSprite} other - Another sprite to detect collision
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @returns {boolean}
     */
    isColliding(other, x, y) {
        for (const layer of other.collision_layers) {
            if (this.collision_masks.has(layer)) {
                return this.overlap(other, x, y);
            }
        }
    }

    /**
     * Find hypothetical collision with any sprite
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @returns {BaseSprite | null} Sprite in a tile that is colliding
     */
    isCollidingAnySprite(x = this.x, y = this.y) {
        for (const sprite of sprites) {
            if (sprite == this) continue;
            if (this.isColliding(sprite, x, y)) {
                return sprite;
            }
        }
        return null;
    }

    /**
     * Find collision using tile
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @returns {BaseSprite} Sprite that is colliding
     */
    isCollidingUsingTile(x, y) {
        // check own occupied tile if collding with target
        for (const neighbour of this.tile.doubleNeighbour()) {
            for (const target of neighbour.occupied) {
                if (this.isColliding(target, x, y)) {
                    return target;
                }
            }
        }

        return null;
    }

    isCollidingUsingTileExcluding(x, y, exclude) {
        // check own occupied tile if collding with target
        for (const neighbour of getTile(x, y).doubleNeighbour()) {
            for (const target of neighbour.occupied) {
                if (target != exclude && this.isColliding(target, x, y)) {
                    return target;
                }
            }
        }

        return null;
    }

    /**
     * Find neighbouring sprite of current sprite in a range
     * @param {number} range - Radius for search
     * @param {...BaseSprite} targetClasses - Classes to target, "all" if target all
     * @returns {Array<BaseSprite>} Sprite sorted by distance
     */
    findRangedTargetsSorted(range, ...targetClasses) {
        const targetSprites = [];

        for (const sprite of sprites) {
            if (anyInstance(sprite, targetClasses)) {
                const dist = distance(this.x, this.y, sprite.x, sprite.y);
                if (dist <= range) {
                    targetSprites.push({ sprite, dist });
                }
            }
        }

        targetSprites.sort((a, b) => a.dist - b.dist);

        return targetSprites.map(item => item.sprite);
    }
}

/**
 * @param {number} x1, y1, x2, y2
 * @returns {number} - Diagonal distance
 */
function distance(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
}

/**
 * Find sprite that is in the targetClasses
 * @param {...Class} targetClasses  - The class that you wish to find, example: Tree
 * @returns {Array<BaseSprite>} - array of sprites corresponding to the target classes
 */
function findTargets(...targetClasses) {
    const targetSprites = [];
    if (targetClasses.length === 0) {
        return [];
    }

    for (const sprite of sprites) {
        if (anyInstance(sprite, targetClasses)) {
            targetSprites.push(sprite);
        }
    }
    return targetSprites;
}

function anyInstance(target, classes) {
    if (classes == "All") {
        return true;
    }

    for (const typeClass of classes) {
        if (target instanceof typeClass) return true;
    }

    return false;
}
