/**
 * Sprite for spawning police
 * @class
 * @extends {BaseSprite}
 */
class PoliceStation extends BaseSprite {
    constructor(x, y) {
        super({
            x,
            y,
            color: "#ff0000",
            collision_layers: new Set(["policeStation"]),
            collide_range: tileSize / 2
        });
        this.lastUpdate = Date.now();
        this.spawnCoolDown = 3000;
        this.maxSpawn = 3;
        this.spawned = 0;
    }

    _update() {
        let now = Date.now();

        if (now - this.lastUpdate > this.spawnCoolDown && this.spawned < this.maxSpawn) {
            movables.push(new Police(this.x, this.y));
            this.lastUpdate = now;
            this.spawned++;
        }
    }
}
