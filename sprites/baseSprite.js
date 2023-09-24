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
        this.collide_range = config.collide_range || 10;
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

        if (this.img === null) {
            fill(this.config.color);
            circle(drawX, drawY, 10);
        } else {
            image(img, drawX, drawY);
        }

        if (displayCoord) {
            push();
            stroke(this.config.color);
            text(
                `(${Math.round(this.x)}, ${Math.round(this.y)})`,
                drawX,
                drawY - 20
            );
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
                if (dist.mag() < this.collide_range) {
                    return true;
                }
                return false;
            }
        }

        return false;
    }

    collideHypothetically(other, x, y) {
        for (let mask of this.collision_masks) {
            if (other.collision_layers.includes(mask)) {
                let dist = createVector(x - other.x, y - other.y);
                if (dist.mag() < this.collide_range) {
                    return true;
                }
                return false;
            }
        }

        return false;
    }
}
