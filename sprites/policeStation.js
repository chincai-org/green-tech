/**
 * Sprite for spawning policeeee
 * @class
 * @extends {BaseSprite}
 */
class PoliceStation extends BaseSprite {
    constructor(x, y) {
        super({ x, y, color: "#ff0000" });
        this.lastUpdate = Date.now();
        this.spawnCoolDown = 3000;
    }

    _update() {
        let now = Date.now();

        if (now - this.lastUpdate > this.spawnCoolDown) {
            movables.push(new Police(this.x, this.y));
            this.lastUpdate = now;
        }
    }
}
