class Bullet extends BaseSprite {
    constructor(parent, directionX, directionY) {
        super({
            x: parent.x,
            y: parent.y,
            color: "#91a8cf",
            collision_layers: new Set(["all"]),
            collision_masks: new Set(["lumberjack"]),
            collide_range: (tileSize / 2) * 0.8,
            name: "Rock",
            speed: widthRatio * 0.5,
            damage: parent.damage
        });
        this.directionX = directionX;
        this.directionY = directionY;
    }

    _tick() {
        this.move(this.directionX, this.directionY);
    }

    move(x, y) {
        let vectDist = Math.hypot(x, y);
        const newX =
            this.x +
            this.speed * this.deltaTime * (vectDist == 0 ? x : x / vectDist);
        const newY =
            this.y +
            this.speed * this.deltaTime * (vectDist == 0 ? y : y / vectDist);

        if (!inBoundOfMap(newX, newY)) {
            unappendSprite(this);
        }

        this.x = newX;
        this.y = newY;

        const isAttack = this.isCollidingUsingTile(newX, newY);
        if (isAttack) {
            this.attack(isAttack, this.damage);
            unappendSprite(this);
        }

        this.checkMapChange();
    }

    // Visual representation with optional tracer effect
    _draw(drawX, drawY) {
        if (this.img === null) {
            // Draw default bullet visualization
            fill(255, 204, 0);
            noStroke();
            ellipse(drawX, drawY, 8 * widthRatio, 8 * widthRatio);

            // Draw tracer effect
            const trailLength = 5;
            for (let i = 0; i < trailLength; i++) {
                const alpha = 255 * (1 - i / trailLength);
                fill(255, 234, 0, alpha);
                ellipse(
                    drawX -
                        ((this.x - this.lastMapUpdatePos.x) * i) / trailLength,
                    drawY -
                        ((this.y - this.lastMapUpdatePos.y) * i) / trailLength,
                    6 * widthRatio,
                    6 * widthRatio
                );
            }
        }
    }
}
