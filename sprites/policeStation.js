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
            collide_range: tileSize / 2,
            name: "PoliceStation"
        });
        this.spawnTimer = new Timer(3000);
        this.maxSpawn = 3;
        this.spawned = 0;
    }

    _tick() {
        if (this.spawnTimer.check() && this.spawned < this.maxSpawn) {
            const newPolice = new Police(this.x, this.y);
            newPolice.parent = this;
            appendSprite(newPolice);
            this.spawned++;
        }
    }
}
