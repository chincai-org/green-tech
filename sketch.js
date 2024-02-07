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
let debugMode = false;
let camX, camY;
let hotkey = -1;

// tile draw
let startTileX;
let startTileY;
let endTileX;
let endTileY;
let tileBuffer = 2;

let resource = 50;
let energy = 1000;
let pollution = 1000;
let polluteRate = 10;
let lastPollute;

// Game tick
const maxDeltaTime = 500;
let delta = 0;
const tickSpeed = 60;
const msBetweenTicks = 1000 / tickSpeed;

function windowResized() {
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

    const now = Date.now();
    let deltaTime = now - lastUpdate;

    deltaTime = (deltaTime > maxDeltaTime) ? 0 : deltaTime;

    // Game tick
    delta += deltaTime / msBetweenTicks;
    while (delta >= 1) {
        gameTick();
        delta--;
    }

    sprout.draw();

    drawGridLine();

    for (let movable of movables) {
        movable.draw();
    }

    let startX = camX - windowWidth / 2;
    let startY = camY - windowHeight / 2;
    startTileX = Math.ceil(startX / tileSize);
    startTileY = Math.ceil(startY / tileSize);

    let endX = startX + windowWidth;
    let endY = startY + windowHeight;
    endTileX = Math.ceil(endX / tileSize);
    endTileY = Math.ceil(endY / tileSize);

    startTileX = (startTileX - tileBuffer < 0) ? startTileX : startTileX - tileBuffer;
    endTileX = (endTileX + tileBuffer > gridWidth) ? endTileX : endTileX + tileBuffer;
    startTileY = (startTileY - tileBuffer < 0) ? startTileY : startTileY - tileBuffer;
    endTileY = (endTileY + tileBuffer < gridHeight) ? endTileY : endTileY + tileBuffer;


    for (let row of tileGrid.slice(startTileY, endTileY)) {
        for (let tile of row.slice(startTileX, endTileX)) {
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

function gameTick() {
    sprout.tick();
    for (let movable of movables) {
        movable.tick();
    }
    for (let tile of Tile.tileWithSprite) {
        tile.tick();
    }
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
function pathFind(maxIterations, maxTarget, range, sprite, ...targetClasses) {
    const targetTiles = sprite.findClosestNeighbourTargetTile(range, ...targetClasses);
    const startTile = getTile(sprite.x, sprite.y);
    let path = [];

    for (const targetTile of targetTiles.slice(0, maxTarget)) {
        const maxIterationsPerTarget = maxIterations / targetTiles.slice(0, maxTarget).length;
        path = astar(maxIterationsPerTarget, startTile, targetTile, sprite, ...targetClasses);
        if (path != 0) {
            return path;
        }
    }

    return path;
}

function astar(maxIterations, start, end, sprite, ...targetClasses) {
    start.g = 0;
    let openSet = [start];
    let closedSet = [];

    let iteration = 0;
    while (openSet.length > 0 && iteration < maxIterations) {
        let current = openSet[0];
        for (let i = 1; i < openSet.length; i++) {
            if (openSet[i].f < current.f || (openSet[i].f === current.f && openSet[i].h < current.h)) {
                current = openSet[i];
            }
        }

        openSet = openSet.filter(node => node !== current);
        closedSet.push(current);

        if (current.x == end.x && current.y == end.y) {
            // Path found, reconstruct and return path
            const path = [];
            let temp = current;
            while (temp) {
                path.unshift({ x: temp.x, y: temp.y });
                temp = temp.parent;
            }
            return path;
        }

        const neighbors = findNeighbour(current);
        for (const neighbor of neighbors) {
            if (closedSet.includes(neighbor) ||
                checkCollisionAlongPath(sprite,
                    { x: (current.x + 0.5) * tileSize, y: (current.y + 0.5) * tileSize },
                    { x: (neighbor.x + 0.5) * tileSize, y: (neighbor.y + 0.5) * tileSize },
                    ...targetClasses)) {
                continue;
            }

            const tentativeG = current.g + 1; // Assuming each step costs 1

            if (!openSet.includes(neighbor)) {
                neighbor.g = tentativeG;
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
                openSet.push(neighbor);
            }
            else if (tentativeG < neighbor.g) {
                neighbor.g = tentativeG;
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;

            }
        }

        iteration++;
    }

    // No path found
    return [];
}

function checkCollisionAlongPath(sprite, startPoint, endPoint, ...exclude) {
    const intermediatePoints = generatePointsOnLine(startPoint, endPoint, 3);
    for (points of intermediatePoints) {
        if (sprite.isCollidingAnySpriteUsingTile(points.x, points.y, ...exclude)) {
            return true;
        }
    }

    return false;
}

function generatePointsOnLine(startPoint, endPoint, numberOfPoints) {
    const points = [];
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;

    for (let i = 0; i < numberOfPoints; i++) {
        const ratio = i / (numberOfPoints);
        const x = startPoint.x + dx * ratio;
        const y = startPoint.y + dy * ratio;
        points.push({ x: x, y: y });
    }

    return points;
}


function heuristic(node, end) {
    // Manhattan distance heuristic
    return Math.abs(node.x - end.x) + Math.abs(node.y - end.y);
}

/**
 * Find tiles of all movable including sprout
 * @param {...Class} targetClasses  - The class that you wish to find, example: Tree
 * @returns {Set} - Set of tiles corresponding to the target classes
 */
function getTilesOfTargetMovable(...targetClasses) {
    const targetTiles = new Set();
    for (const movable of [].concat(movables, sprout)) {
        if (anyInstance(movable, targetClasses)) {
            movableTile = getTile(movable.x, movable.y);
            movableTile.isTileWithMovable = true;
            movableTile.refrenceSprite = movable;
            targetTiles.add(getTile(movable.x, movable.y));
        }
    }
    return targetTiles;
}

/**
 * Find tiles with sprite that is in the targetClasses
 * @param {...Class} targetClasses  - The class that you wish to find, example: Tree
 * @returns {Set} - Set of tiles corresponding to the target classes
 */
function getTilesOfTargetTiles(...targetClasses) {
    const targetTiles = new Set();
    for (const tile of Tile.tileWithSprite) {
        if (anyInstance(tile.sprite, targetClasses)) {
            movableTile.isTileWithMovable = false;
            movableTile.refrenceSprite = null;
            targetTiles.add(tileGrid[tile.y][tile.x]);
        }
    }
    return targetTiles;
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
    if (classes == "All") {
        return true;
    }

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
