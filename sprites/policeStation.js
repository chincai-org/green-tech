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
        this.timeSpawned = Date.now();
        this.spawnCoolDown = 3000;
        this.maxSpawn = 3;
        this.spawned = 0;
    }

    _tick() {
        // Debug test
        let lumberjacksTiles = this.findNeighbourTargetTile(5, Lumberjack);
        if (lumberjacksTiles.length != 0) {
            console.log(lumberjacksTiles);
        }
        
        if (Date.now() - this.timeSpawned > this.spawnCoolDown && this.spawned < this.maxSpawn) {
            movables.push(new Police(this.x, this.y));
            this.timeSpawned = Date.now();
            this.spawned++;
        }
    }
}
