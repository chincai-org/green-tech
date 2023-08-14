const grid = [];
const movables = [];
const sprout = new Sprout(100, 100);

let lastUpdate = Date.now();
let deltaTime;

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

    sprout.update(deltaTime);
    sprout.draw();

    for (let movable of movables) {
        movable.update(deltaTime);
        movable.draw();
    }

    lastUpdate = now;
}

function keyPressed() {}
