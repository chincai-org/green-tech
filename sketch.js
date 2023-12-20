/** Type definition code heree
 * @typedef {Object} Vector
 * @property {Number} x
 * @property {Number} y
 */

let sproutFrontImg;

const constWinWidth = 1920;
const constWinHeight = 1080;
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;
let widthRatio = winWidth / constWinWidth;
let heightRatio = winHeight / constWinHeight;

const fullScreenElement = document.documentElement;
const movables = [];
const sprout = new Sprout(50, 50);
const gridWidth = 100;
const gridHeight = 100;
const tileGrid = [];
let tileSize = (constWinWidth * widthRatio) / 30;
// let song;

let lastUpdate = Date.now();
let deltaTime;
let debugMode = false;
let camX, camY;
let hotkey = -1;

let resource = 50;
let energy = 1000;
let pollution = 1000;
let polluteRate = 10;
let lastPollute;

function windowResized() {
    console.log("resized");
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
    widthRatio = winWidth / constWinWidth;
    heightRatio = winHeight / constWinHeight;
    tileSize = (constWinWidth * widthRatio) / 30;
    sprout.speed = widthRatio * 0.5;
    resizeCanvas(winWidth, winHeight);
}

function preload() {
    soundFormats("ogg", "wav");
    sproutFrontImg = loadImage(sprout.config.img);
    // song = loadSound("bestmusic.wav");
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.style("position", "fixed");
    canvas.style("top", "0");
    canvas.style("left", "0");
    canvas.style("z-index", "-1");
    canvas.parent("body");
    canvas.mouseClicked(canvasClicked);

    initGrid();
    //initUi();

    // bgsong();

    lastPollute = Date.now();
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

    let startX = camX - windowWidth / 2;
    let startY = camY - windowHeight / 2;
    let startTileX = Math.ceil(startX / tileSize);
    let startTileY = Math.ceil(startY / tileSize);

    let endX = startX + windowWidth;
    let endY = startY + windowHeight;
    let endTileX = Math.ceil(endX / tileSize);
    let endTileY = Math.ceil(endY / tileSize);

    for (let row of tileGrid.slice(startTileY, endTileY)) {
        for (let tile of row.slice(startTileX, endTileX)) {
            tile.update(deltaTime);
            tile.draw();
        }
    }

    // Check if last pollute is a minute ago
    if (now - lastPollute > 60000) {
        pollution += polluteRate;

        // Reset last pollute
        lastPollute = now;
    }

    lastUpdate = now;

    uiUpdate();
}

// function bgsong() {
//     song.loop();
// }

function keyPressed() {
    const CTRL_KEY_CODE = 17;
    const hotkeys = {
        84: 0, // tree
        80: 1, // police station
        76: 2, // lumberjack
        82: 3 // rock
    };

    if (keyCode === CTRL_KEY_CODE) {
        debugMode = !debugMode;
        return false;
    }

    switch (keyCode) {
        case 84:
        case 80:
        case 76:
        case 82:
            setHotkey(hotkeys[keyCode]);
            break;
        case 69:
            sprout.chopWood(); // chop wood
            break;
        case 107:
            resource += 100;
            break;
    }
    return false;
}

function canvasClicked() {
    let disX = windowWidth / 2 - mouseX;
    let disY = windowHeight / 2 - mouseY;

    let realX = camX - disX;
    let realY = camY - disY;

    let tile = getTile(realX, realY);

    if (
        // isMouseOnAnyUi() ||
        tile === getTile(sprout.x, sprout.y) ||
        tile.sprite != null
    ) {
        return;
        // Preven placing when:
        // 1. sprout is in the same tile
        // 2. tile already have a sprite
        // 3. is on any ui
    }

    switch (hotkey) {
        case 0:
            if (resource >= 1) {
                tile.add(new Tree(0, 0));
                resource -= 1;
            }
            break;
        case 1:
            tile.add(new PoliceStation(0, 0));
            break;
        case 2:
            movables.push(
                new Lumberjack(
                    mouseX + camX - windowWidth / 2,
                    mouseY + camY - windowHeight / 2
                )
            );
            break;
        case 3:
            tile.add(new Rock(0, 0));
            break;
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

function inBoundOfGrid(tileX, tileY) {
    return (
        tileX >= 0 &&
        tileX < tileGrid[0].length &&
        tileY >= 0 &&
        tileY < tileGrid.length
    );
}
function inBoundOfMap(x, y) {
    return (
        x >= 0 &&
        x < tileGrid[0].length * gridWidth &&
        y >= 0 &&
        y < tileGrid.length * gridHeight
    );
}

function drawGridLine() {
    let sx = sprout.x;
    let sy = sprout.y;
    let halfWindowWidth = windowWidth / 2;
    let halfWindowHeight = windowHeight / 2;

    let cx = max(
        min(sx, gridWidth * tileSize - halfWindowWidth),
        halfWindowWidth
    );
    let cy = max(
        min(sy, gridHeight * tileSize - halfWindowHeight),
        halfWindowHeight
    );

    let gx = (cx - halfWindowWidth) % tileSize;
    let gy = (cy - halfWindowHeight) % tileSize;

    push();
    stroke(0xffffff);
    strokeWeight(1);

    for (let i = 0; i < windowWidth / tileSize + 1; i++) {
        line(i * tileSize - gx, 0, i * tileSize - gx, windowHeight);
    }

    for (let i = 0; i < windowHeight / tileSize + 1; i++) {
        line(0, i * tileSize - gy, windowWidth, i * tileSize - gy);
    }
    pop();
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {Tile}
 */
function getTile(x, y) {
    return tileGrid[Math.floor(y / tileSize)][Math.floor(x / tileSize)];
}

function openFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * @typedef {Object} Class - Just the class
 * @param {BaseSprite} sprite - The instance of the sprite to start from
 * @param {...Class} targetClasses  - The class that you wish to find, example: Tree
 * @returns {Array<Vector>}
 */
function pathFind(sprite, ...targetClasses) {
    const startTile = getTile(sprite.x, sprite.y);
    const tileX = startTile.x;
    const tileY = startTile.y;

    // Stop lag
    if (anyInstance(startTile.sprite, targetClasses)) return [];

    // implement BFS
    const queue = [[createVector(tileX, tileY)]];
    const visited = new Set();
    visited.add(`${tileX},${tileY}`);

    while (queue.length > 0) {
        // Check if the queue is empty
        const currentPath = queue.shift();
        const lastTile = currentPath.at(-1);

        for (const neighbor of findNeighbour(lastTile)) {
            const neighborTile = tileGrid[neighbor.y][neighbor.x];

            if (visited.has(`${neighbor.x},${neighbor.y}`)) continue; // Ignore visited tile

            // Check for hypothetical collision
            if (
                neighborTile.sprite != null &&
                !anyInstance(neighborTile.sprite, targetClasses) &&
                sprite.collideHypothetically(
                    neighborTile.sprite,
                    (neighborTile.x + 0.5) * tileSize,
                    (neighborTile.y + 0.5) * tileSize
                )
            )
                continue;

            visited.add(`${neighbor.x},${neighbor.y}`);

            const newPath = currentPath.concat([neighborTile]);

            if (anyInstance(neighborTile.sprite, targetClasses)) return newPath;

            queue.push(newPath); // Add the newPath to the queue
        }
    }

    return []; // No path found
}

/**
 *
 * @param {Vector} vector - coordinate of the tile
 * @returns {Array<Vector>} - all the neighbour of the tile
 */
function findNeighbour(vector) {
    const { x, y } = vector;

    let result = [];

    // returns neighbour to all 8 directions, and x and y cannot be lower than 0 and higher than the map size
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const neighbour = createVector(x + dx, y + dy);
            if (inBoundOfGrid(neighbour.x, neighbour.y)) {
                // Priotize horizontal or vertical movement
                if (Math.abs(dx) + Math.abs(dy) == 2) {
                    result.push(neighbour);
                } else {
                    result.unshift(neighbour);
                }
            }
        }
    }

    return result;
}

/**
 *
 * @param {Vector} vector - coordinate of the tile
 * @returns {Array<Vector>} - all the neighbour of the tile
 */
function findNeighbourNoDiagonal(vector) {
    const { x, y } = vector;

    let result = [];

    const directions = [
        { dx: 0, dy: -1 }, // Up
        { dx: 0, dy: 1 }, // Down
        { dx: -1, dy: 0 }, // Left
        { dx: 1, dy: 0 } // Right
    ];

    // returns neighbour to all 4 directions, and x and y cannot be lower than 0 and higher than the map size
    for (const direction of directions) {
        const neighbour = createVector(x + direction.dx, y + direction.dy);
        if (inBoundOfGrid(neighbour.x, neighbour.y)) result.push(neighbour);
    }

    return result;
}

function anyInstance(target, classes) {
    for (const typeClass of classes) {
        if (target instanceof typeClass) {
            return true;
        }
    }

    return false;
}

/**
 * @param {CallableFunction} callable
 */
function virtualEdit(callable) {
    push();
    callable();
    pop();
}
