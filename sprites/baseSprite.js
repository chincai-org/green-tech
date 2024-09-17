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
        this.animation = { x: 0, y: 0, speed: 0, time: 0 };
        this.deltaTime = 0;
        this.idleTime = 0;
        this.onTile = false;
    }

    static _ref = null;

    static ref() {
        if (!BaseSprite._ref) {
            BaseSprite._ref = new BaseSprite(0, 0);
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
            }
            else {
                this.deltaTime = 0;
            }
            const lastX = this.x;
            const lastY = this.y;
            this._tick();
            if (lastX == this.x && lastY == this.y) {
                this.idleTime += deltaTime;
            }
            else {
                this.idleTime = 0;
            }
            this.lastUpdate = Date.now();
        }
    }

    /**
     * @param {Int} x - The x direction to move to
     * @param {Int} y - The y direction to move to
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
        if (this.distanceHyp(x, y) < tileSize / 4) {
            return true;
        }
        else {
            this._move(x - this.x, y - this.y, this.speed);
            return false;
        }
    }

    moveToTile(x, y) {
        return this.moveTo(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2)
    }

    checkMapChange(forced) {
        let currTile = getTile(this.x, this.y);
        let oldTileToCheck = findNeighbour(this.tile);
        if (this.tile != currTile || forced) {
            this.tile = currTile;

            // hard coded for lumberjack
            let tileToCheck = findNeighbour(this.tile);
            let center = this.tile.center();
            navMesh.set(this.tile, Lumberjack.ref().isCollidingInRange(center.x, center.y, Lumberjack.ref().collide_range + tileSize));

            const processTile = (tile) => {
                let center = centerFromCoord(tile.x, tile.y);
                navMesh.set(tileGrid[tile.y][tile.x], Lumberjack.ref().isCollidingInRange(center.x, center.y, Lumberjack.ref().collide_range + tileSize));
            };

            oldTileToCheck.forEach(tile => processTile(tile));
            tileToCheck.forEach(tile => processTile(tile));

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
                for (const sprite of sprites) {
                    if (sprite.x == this.x && sprite.y == this.y) {
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
        // handle animation
        if (this.animation.time > 0) {
            this.move(this.animation.x, this.animation.y, this.animation.speed, this.animation);
            this.animation.time -= this.deltaTime;
        }
    }

    /**
     * @param {Int} x - The x direction to move to
     * @param {Int} y - The y direction to move to
     * @param {Boolean} checkCollision - Check for collision when moving if then stop
     */
    _move(x, y, speed) {
        // Handle queued up movement
        let vectDist = Math.hypot(x, y);
        const newX = this.x +
            speed *
            this.deltaTime *
            (vectDist == 0 ? x : x / vectDist);
        const newY = this.y +
            speed *
            this.deltaTime *
            (vectDist == 0 ? y : y / vectDist);
        if (inBoundOfMap(newX, newY)) {
            // cliping in map
            if (this.isCollidingInRange(this.x, this.y, this.collide_range + tileSize)) {
                this.x = newX;
                this.y = newY;
            }
            if (!this.isCollidingInRange(newX, this.y, this.collide_range + tileSize)) {
                this.x = newX;
            }
            if (!this.isCollidingInRange(this.x, newY, this.collide_range + tileSize)) {
                this.y = newY;
            }
        }

        this.checkMapChange();
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

    distanceHyp(x, y) {
        return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
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
     * Find hypothetical collision with any sprite 
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @param {...BaseSprite} excluding - Sprites to exclude from collision check
     * @returns {BaseSprite | null} Sprite in a tile that is colliding
     */
    isCollidingAnySprite(x = this.x, y = this.y, ...excluding) {
        for (const sprite of sprites) {
            if (sprite == this) continue;
            if (anyInstance(sprite, excluding)) continue;
            if (this.isColliding(sprite, x, y)) {
                return sprite;
            }
        }
        return null;
    }

    /**
     * Find collision in a range using tile
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @param {number} range - Radius for search
     * @returns {BaseSprite} Sprite that is colliding
     */
    isCollidingInRange(x, y, range, ...excluding) {
        const targets = findRangedTargets(x, y, range);
        for (const target of targets) {
            if (this.isColliding(target, x, y, ...excluding)) {
                return target;
            }
        }
        return null;
    }

    /**
     * Find closest neighbour tile by searching spirarly
     * @param {number} range - Radius for search
     * @param {...BaseSprite} targetClasses - Classes to target, all if empty
     * @returns {Array<BaseSprite>} Sprite sorted from distance
     */

    findRangedTargetsSorted(range, ...targetClasses) {
        return findRangedTargets(this.x, this.y, range, ...targetClasses).sort((a, b) => this.distanceHyp(a.x, a.y) - this.distanceHyp(b.x, b.y));
    }
}

function findRangedTargets(x, y, range, ...targetClasses) {
    return findTargets(...targetClasses).filter(target => distance(x, y, target.x, target.y) <= range);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}


/**
 * Find sprite that is in the targetClasses
 * @param {...Class} targetClasses  - The class that you wish to find, example: Tree
 * @returns {Array<BaseSprite>} - array of sprites corresponding to the target classes
 */
function findTargets(...targetClasses) {
    const targetSprite = [];
    if (targetClasses.length == 0) {
        return sprites;
    }

    for (const sprite of sprites) {
        if (anyInstance(sprite, targetClasses)) {
            targetSprite.push(sprite);
        }
    }
    return targetSprite;
}