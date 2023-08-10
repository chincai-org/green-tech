class BaseSprite {
    constructor(config) {
        this.config = config;

        ({
            id: this.id,
            x: this.x,
            y: this.y,
            hp: this.hp,
            damage: this.damage,
            speed: this.speed,
            cost: this.cost
        } = config);
    }

    update() {
        _update();
    }

    move() {
        _move();
    }

    _update() {}

    _move(deltaTime) {
        // TODO: base move
        square(0,0,10)
    }
}
