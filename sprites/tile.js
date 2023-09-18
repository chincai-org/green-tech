class Tile extends BaseSprite {
    constructor(x, y, sprite = null) {
        super({ x, y });
        this.add(sprite);
    }

    draw() {
        this.sprite?.draw();
    }

    _update(deltaTime) {
        this.sprite?.update(deltaTime);
    }

    add(sprite) {
        this.sprite = sprite;

        if (sprite) {
            this.sprite.tile = this;
            this.sprite.x = (this.x + 0.5) * tileSize;
            this.sprite.y = (this.y + 0.5) * tileSize;
        }
    }

    remove() {
        if (this.sprite) {
            this.sprite.tile = null;
            this.sprite = null;
        }
    }
}
