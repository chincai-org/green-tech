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
    let changeInWidth = window.innerWidth / winWidth;
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
    widthRatio = winWidth / constWinWidth;
    heightRatio = winHeight / constWinHeight;
    tileSize = (constWinWidth * widthRatio) / 30;
    sprout.speed = widthRatio * 0.5;
    resizeCanvas(winWidth, winHeight);

    // Resize movables
    sprout.x *= changeInWidth;
    sprout.y *= changeInWidth;
    sprout.collide_range *= changeInWidth;
    movables.forEach(sprite => {
        sprite.x *= changeInWidth;
        sprite.y *= changeInWidth;
        sprite.collide_range *= changeInWidth;
    });

    // Resize tiles
    for (let i = 0; i < tileGrid.length; i++) {
        for (let j = 0; j < tileGrid[i].length; j++) {
            tileGrid[j][i].onResize(changeInWidth);
        }

    }
}

function preload() {
    soundFormats("ogg", "wav");
    sproutFrontImg = loadImage(sprout.img);
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

    // bgsong();

    lastPollute = Date.now();

    // Init sprite
    sprout.collide_range = tileSize / 2;
}

function draw() {
    background(0);

    let now = Date.now();
    deltaTime = now - lastUpdate;

    // possible fix for when screen not focus which will cause sprite to have large deltaTime suddenly
    (deltaTime > 500) ? deltaTime = 0 : deltaTime;

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

    if (tile.sprite != null) {
        return;
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
            movables.push(new Lumberjack(realX, realY));
            break;
        case 3:
            tile.add(new Rock(0, 0));
            break;
        default:
            return;
    }

    // Remove if colliding with any sprite
    if (tile.sprite) {
        if (tile.sprite.isCollidingAnySprite(tile.sprite.x, tile.sprite.y)) {
            tile.remove();
        }
    }
    else {
        let lastMovable = movables[movables.length - 1];
        if (lastMovable.isCollidingAnySprite(lastMovable.x, lastMovable.y)) {
            movables.pop();
        }
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
        tileX < gridWidth &&
        tileY >= 0 &&
        tileY < gridHeight
    );
}
function inBoundOfMap(x, y) {
    return (
        x >= 0 &&
        x < tileSize * gridWidth &&
        y >= 0 &&
        y < tileSize * gridHeight
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
function pathFind(maxIterations, sprite, ...targetClasses) {
    const startTile = getTile(sprite.x, sprite.y);
    const tileX = startTile.x;
    const tileY = startTile.y;

    // Stop lag
    if (anyInstance(startTile.sprite, targetClasses)) return [];

    // implement BFS
    const queue = [[{ x: tileX, y: tileY }]];
    const visited = new Set();
    visited.add(`${tileX},${tileY}`);

    let iterations = 0;

    while (queue.length > 0 && iterations < maxIterations) {
        // Check if the queue is empty
        const currentPath = queue.shift();
        const lastTile = currentPath.at(-1);

        for (const neighbor of findNeighbour(lastTile)) {
            const neighborTile = tileGrid[neighbor.y][neighbor.x];
            const tileCenterX = (neighborTile.x + 0.5) * tileSize;
            const tileCenterY = (neighborTile.y + 0.5) * tileSize;

            if (visited.has(`${neighbor.x},${neighbor.y}`)) continue; // Ignore visited tile

            if (sprite.isCollidingAnySprite(tileCenterX, tileCenterY)) {
                continue;
            }

            visited.add(`${neighbor.x},${neighbor.y}`);

            const newPath = currentPath.concat([{ x: neighborTile.x, y: neighborTile.y }]);

            if (anyInstance(neighborTile.sprite, targetClasses)) return newPath;

            queue.push(newPath); // Add the newPath to the queue
        }

        iterations++;
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
            const neighbour = { x: x + dx, y: y + dy };
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
        const neighbour = { x: x + direction.dx, y: y + direction.dy };
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

// Remove because live server
/*
// Prevent Ctrl + W
window.addEventListener('beforeunload', function (e) {
    // Display a confirmation messagea
    var confirmationMessage = 'Really want to quit the game?';
    e.returnValue = confirmationMessage; // Standard for most browsers
    return confirmationMessage; // For some older browsers
});
*/
