const grid = [];
const movables = [];
const sprout = new Sprout(100, 100);
const tileSize = 32;

let lastUpdate = Date.now();
let deltaTime;
let displayCoord = false;

function setup() {
    console.log("hi");
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.style("position", "fixed");
    canvas.style("top", "0");
    canvas.style("left", "0");
    canvas.style("z-index", "-1");
    canvas.parent("body");
}

function draw() {
    background(0);

    let now = Date.now();
    deltaTime = now - lastUpdate;

    drawGridLine();

    sprout.update(deltaTime);
    sprout.draw();

    for (let movable of movables) {
        movable.update(deltaTime);
        movable.draw();
    }

    lastUpdate = now;
}

function keyPressed() {
    // Check if key code is CTRL
    if (keyCode === 17) {
        displayCoord = !displayCoord;
    }
    }

    function drawGridLine() {
        let sx = sprout.x;
        let sy = sprout.y;

        let cx = sx % tileSize;
        let cy = sy % tileSize;

    stroke(0xffffff);

    for (let i = 0; i < windowWidth / tileSize + 1; i++) {
        line(i * tileSize - cx, 0, i * tileSize - cx, windowHeight);
    }

    for (let i = 0; i < windowHeight / tileSize + 1; i++) {
        line(0, i * tileSize - cy, windowWidth, i * tileSize - cy);
    }
}
