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

        // console.log(config);

        // console.log(this.id);
    }

    update(deltaTime) {
        // console.log("update");
        this._update(deltaTime);
    }

    move(deltaTime, vector) {
        this._move(deltaTime, vector);
    }

    draw() {
        let cx = sprout.x;
        let cy = sprout.y;
        if (sprout.x < windowWidth / 2) {
            cx = windowWidth / 2;
        } else if (sprout.x > gridWidth * tileSize - windowWidth / 2) {
            cx = windowWidth / 2;
        }
        if (sprout.y < windowHeight / 2) {
            cy = windowHeight / 2;
        } else if (sprout.y > gridHeight * tileSize - windowHeight / 2) {
            cy = windowHeight / 2;
        }
        let distance = this.distance(0, cx, cy);
        let drawX = windowWidth / 2 + distance.x;
        let drawY = windowHeight / 2 + distance.y;

        if (this.config.color) {
            fill(this.config.color);
            circle(drawX, drawY, 10);
        } else {
            // TODO: draw image
        }
    }

    _update(deltaTime) {
        this.move(deltaTime);
    }

    _move(deltaTime, vector = createVector(0, 0)) {
        // TODO: base move
        let vectDist = Math.sqrt(vector.x ** 2 + vector.y ** 2);
        this.x +=
            this.speed *
            deltaTime *
            (vectDist > vector.x ? vector.x / vectDist : vector.x);
        this.y +=
            this.speed *
            deltaTime *
            (vectDist > vector.y ? vector.y / vectDist : vector.y);
    }

    distance(other, x, y) {
        return createVector(
            this.x - (other.x ? other.x : x),
            this.y - (other.y ? other.y : y)
        );
    }
}
