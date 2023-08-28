class Police extends BaseSprite {
    constructor(x, y) {
        super({ x, y, color: "#40E0D0", speed: 0.3 });
    }

    _update(deltaTime) {
        this.move(deltaTime, createVector(randint(-1, 1), randint(-1, 1)));
    }
}
