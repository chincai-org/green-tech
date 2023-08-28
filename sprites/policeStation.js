class PoliceStation extends BaseSprite {
    constructor(x, y) {
        super({ x, y, color: "#ff0000" });
        this.lastUpdate = Date.now();
        this.spawnCoolDown = 3000;
    }

    _update() {
        let now = Date.now();
        console.log(this.lastUpdate);

        if (now - this.lastUpdate > this.spawnCoolDown) {
            console.log("Police");
            console.log(movables);
            movables.push(new Police(this.x, this.y));
            this.lastUpdate = now;
        }
    }
}
