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
     * @param {Vector} vector - The direction to move to
     * @param {Boolean} checkCollision - Check for collision when moving if then stop
     */
    move(vector, checkCollision = false) {
        this._move(vector, checkCollision);

        // Update the tile
        unappendMovable(this);

        this.tile = getTile(this.x, this.y);
        appendMovable(this);
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
            if (this instanceof DebugSprite) {
                // Do custom debugging logic here
                // check if multiple sprite in same position
                let samePos = 0;
                for (const movable of movables.get(this.tile)) {
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
        this.move();
    }

    /**
     * @param {Vector} [vector] - The direction to move to
     * @param {Boolean} checkCollision - Check for collision when moving if then stop
     */
    _move(vector = createVector(0, 0), checkCollision = false) {
        const deltaTime = this.deltaTime();
        this.moveObjQueue.push({ vector: vector, checkCollision: checkCollision });
        // Handle queued up movement
        while (this.moveObjQueue.length > 0) {
            const moveObj = this.moveObjQueue.pop();
            const moveVect = moveObj.vector;
            let vectDist = Math.hypot(moveVect.x, moveVect.y);
            const newX = this.x +
                this.speed *
                deltaTime *
                (vectDist == 0 ? moveVect.x : moveVect.x / vectDist);
            const newY = this.y +
                this.speed *
                deltaTime *
                (vectDist == 0 ? moveVect.y : moveVect.y / vectDist);
            if (inBoundOfMap(newX, newY)) {
                if (!moveObj.checkCollision || !this.checkCollisionInRange(newX, newY, 2)) {
                    this.x = newX;
                    this.y = newY;
                }
            }

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
        for (const movableValues of movables.values()) {
            for (const movable of movableValues) {
                if (anyInstance(movable, excluding)) continue;
                if (movable !== this && this.isColliding(movable, x, y)) {
                    return movable;
                }
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
            (this !== sprout && this.isColliding(sprout, x, y, ...excluding));
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
        const currentTile = getTile(x, y);

        for (let i = currentTile.x - range; i <= (currentTile.x + range); i++) {
            for (let j = currentTile.y - range; j <= (currentTile.y + range); j++) {
                if (!inBoundOfGrid(i, j)) continue;
                const tile = tileGrid[j][i];

                if (Tile.tileWithSprite.has(tile)) {
                    const tileSprite = tile.sprite;
                    if (this.isColliding(tileSprite, x, y, ...excluding)) {
                        return tileSprite;
                    }
                }
                if (movables.has(tile)) {
                    const movableSprites = movables.get(tile);
                    for (const movableSprite of movableSprites) {
                        if (this.isColliding(movableSprite, x, y, ...excluding)) {
                            return movableSprite;
                        }
                    }
                }

            }
            if (this !== sprout && this.isColliding(sprout, x, y, ...excluding)) {
                return sprout
            };
        }

        return false;

    }

    /**
     * Find closest neighbour tile by searching spirarly
     * @param {number} x - Hypothetical x-coordinate
     * @param {number} y - Hypothetical y-coordinate
     * @param {number} range - Radius for search
     * @param {...BaseSprite} targetClasses - Classes to target, all if empty
     * @returns {Array<BaseSprite>} Sprite sorted from distance
     */
    findClosestNeighbourUsingTile(hypotheticalX, hypotheticalY, range, ...targetClasses) {
        const targets = findTargets(...targetClasses);

        let result = [];
        const currentTile = getTile(hypotheticalX, hypotheticalY);

        // Loops spirally
        let x = currentTile.x;
        let y = currentTile.y;
        let nMove = 1;
        let dx = 1;
        let dy = 0;

        for (let i = 1; i < range * 4 + 2; i++) {
            // Move
            for (let j = 0; j < nMove; j++) {
                x += dx;
                y += dy;
                if (inBoundOfGrid(x, y)) {
                    for (const target of targets) {
                        if (!target.tile) {
                            continue;
                        };

                        if (target.tile.x == x && target.tile.y == y) {
                            result.push(target);
                        }
                    }
                }
            }

            // Change direction
            const temp = dx;
            dx = -dy;
            dy = temp;

            // Increase move per 2 incriment
            if (i % 2 == 0) {
                nMove++;
            }
        }
        return result;
    }
}
