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

        console.log(config);

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
        if (this.config.color) {
            fill(this.config.color);
            circle(this.x, this.y, 10);
        } else {
            // TODO: draw image
        }
    }

    _update(deltaTime) {
        this.move(deltaTime);
    }

    _move(deltaTime, vector = createVector(0, 0)) {
        // console.log("moved");
        // TODO: base move
        // console.log(vector.x);
        // console.log(vector.y);
        this.x += this.speed * deltaTime * vector.x;
        this.y += this.speed * deltaTime * vector.y;
    }
}
