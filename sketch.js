const grid = [];
const movables = [];
const sprout = new Sprout(10, 10);
const tileSize = 64;
const gridWidth = 70;
const gridHeight = 70;
const tileGrid = [];

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
    canvas.mouseClicked(canvasClicked);

    initGrid();
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

    let startX = sprout.x - windowWidth / 2;
    let startY = sprout.y - windowHeight / 2;
    let startTileX = startX / tileSize;
    let startTileY = startY / tileSize;

    let endX = startX + windowWidth;
    let endY = startY + windowHeight;
    let endTileX = endX / tileSize;
    let endTileY = endY / tileSize;

    for (let row of tileGrid.slice(startTileY, endTileY)) {
        for (let tile of row.slice(startTileX, endTileX)) {
            tile.update(deltaTime);
            tile.draw();
        }
    }

    lastUpdate = now;
}

function keyPressed() {
    // Check if key code is CTRL
    if (keyCode === 17) {
        displayCoord = !displayCoord;
    }
}

function canvasClicked() {
    let disX = windowWidth / 2 - mouseX;
    console.log("🚀 ~ file: sketch.js:61 ~ canvasClicked ~ disX:", disX);
    let disY = windowHeight / 2 - mouseY;
    console.log("🚀 ~ file: sketch.js:63 ~ canvasClicked ~ disY:", disY);
    let realX = sprout.x - disX;
    console.log("🚀 ~ file: sketch.js:65 ~ canvasClicked ~ realX:", realX);
    let realY = sprout.y - disY;
    console.log("🚀 ~ file: sketch.js:67 ~ canvasClicked ~ realY:", realY);
    let tileX = Math.floor(realX / tileSize);
    let tileY = Math.floor(realY / tileSize);
    console.log(tileX, tileY);

    let tile = tileGrid[tileY][tileX];
    tile.add(new Tree(0, 0));
}

function initGrid() {
    for (let y = 0; y < gridHeight; y++) {
        let row = [];

        for (let x = 0; x < gridWidth; x++) {
            let tile = new Tile(x, y);
            row.push(tile);
        }

        tileGrid.push(row);
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
