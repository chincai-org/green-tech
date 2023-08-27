const initialWinWidth = window.innerWidth;
const initialWinHeight = window.innerHeight;
const grid = [];
const movables = [];
const sprout = new Sprout(0, 0);
const gridWidth = 100;
const gridHeight = 100;
const tileGrid = [];
let tileSize = initialWinWidth / 30;

let lastUpdate = Date.now();
let deltaTime;
let displayCoord = false;
let camX, camY;
let hotkey = 0;

function windowResized() {
    console.log("resized");
    tileSize = windowWidth / 30;
    sprout.speed = window.innerWidth / 30 / (initialWinWidth / 15);
    resizeCanvas(windowWidth, windowHeight);
}

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

    sprout.update(deltaTime);
    sprout.draw();

    drawGridLine();

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
    if (keyCode === 84) {
        hotkey = 84; //t
    } else if (keyCode === 80) {
        hotkey = 80; //p
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
    console.log(Math.floor((mouseX + sprout.x) / 64), "x");
    console.log(Math.floor((mouseY + sprout.y) / 64), "y");
    let tileX = Math.floor(realX / tileSize);
    let tileY = Math.floor(realY / tileSize);
    console.log(tileX, tileY);

    let tile = tileGrid[tileY][tileX];
    if (hotkey === 84) {
        tile.add(new Tree(0, 0));
    } else if (hotkey === 80) {
        tile.add(new PoliceStation(0, 0));
    }
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
    let cx = sx;
    let cy = sy;
    if (sx < windowWidth / 2) {
        cx = windowWidth / 2;
    } else if (sx > gridWidth * tileSize - windowWidth / 2) {
        cx = (gridWidth * tileSize - windowWidth / 2) % tileSize;
    }
    if (sy < windowHeight / 2) {
        cy = windowHeight / 2;
    } else if (sy > gridHeight * tileSize - windowHeight / 2) {
        cy = (gridHeight * tileSize - windowHeight / 2) % tileSize;
    }
    let gx = (cx - windowWidth / 2) % tileSize;
    let gy = (cy - windowHeight / 2) % tileSize;

    stroke(0xffffff);

    for (let i = 0; i < windowWidth / tileSize + 1; i++) {
        line(i * tileSize - gx, 0, i * tileSize - gx, windowHeight);
    }

    for (let i = 0; i < windowHeight / tileSize + 1; i++) {
        line(0, i * tileSize - gy, windowWidth, i * tileSize - gy);
    }
}
