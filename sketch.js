/** Type definition code heree
 * @typedef {Object} Vector
 * @property {Number} x
 * @property {Number} y
 */

const initialWinWidth = window.innerWidth;
const initialWinHeight = window.innerHeight;
const fullScreenElement = document.documentElement;
const movables = [];
const sprout = new Sprout(50, 50);
const gridWidth = 100;
const gridHeight = 100;
const tileGrid = [];
const initialTileSize = initialWinWidth / 30;
let tileSize = initialWinWidth / 30;
let song;

let lastUpdate = Date.now();
let deltaTime;
let displayCoord = false;
let camX, camY;
let hotkey = -1;

let resource = 0;
let energy = 1000;

let windowInnerWidth = window.innerWidth;
let windowInnerHeight = window.innerHeight;
let infoBoxOpen = false;
let infoBoxIndicator = [];

function windowResized() {
    tileSize = windowWidth / 30;
    sprout.speed = window.innerWidth / 30 / (initialWinWidth / 15);
    resizeCanvas(windowWidth, windowHeight);

    windowInnerWidth = window.innerWidth;
    windowInnerHeight = window.innerHeight;
}

function preload() {
    soundFormats("ogg", "wav");
    song = loadSound("bestmusic.wav");
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
    initUi();

    bgsong();
}

function draw() {
    background(0);

    let now = Date.now();
    deltaTime = now - lastUpdate;

    sprout.update(deltaTime);
    sprout.draw();

    drawGridLine();
    drawText();

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

    lastUpdate = now;

    updateUi();
    drawAllUi();

    manageInfoBox();
}

function bgsong() {
    song.loop();
}

function keyPressed() {
    // Check if key code is CTRL
    if (keyCode === 17) {
        displayCoord = !displayCoord;
    }

    switch (keyCode) {
        case 84:
            hotkey = 0; // tree
            break;
        case 80:
            hotkey = 1; // police station
            break;
        case 76:
            hotkey = 2; // lumberjack
            break;
        case 69:
            sprout.chopWood(); //chop wood
            break;
        case 107:
            resource += 100;
    }
}

function canvasClicked() {
    let disX = windowWidth / 2 - mouseX;
    let disY = windowHeight / 2 - mouseY;

    let realX = camX - disX;
    let realY = camY - disY;

    let tile = getTile(realX, realY);

    if (isMouseOnAnyUi()) {
        return;
    } else if (getTile(sprout.x, sprout.y) === tile) {
        return; // Prevent place sprite in yourselve
    }

    switch (hotkey) {
        case 0:
            tile.add(new Tree(0, 0));
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

function drawText() {
    virtualEdit(() => {
        let resourceUi = allUi["resource"];
        resourceUi.textColor = "white";
        resourceUi.textStroke = "#f5f5dc";
        resourceUi.textSize = 20;
        resourceUi.text = `Resource: ${resource}`;
        resourceUi.positionX = windowWidth / 2;
        resourceUi.positionY = 20;
    });
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

function mousePressed() {
    for (let index = 0; index < numOfElement; index = index + 1) {
        if (isMouseOverUi(allUi["element" + index])) {
            if (hotkey == index) {
                hotkey = -1;
            } else {
                hotkey = index;
            }
        }
    }

    if (
        isMouseOver(
            infoBoxIndicator[0],
            infoBoxIndicator[1],
            infoBoxIndicator[2],
            infoBoxIndicator[3]
        )
    ) {
        if (infoBoxOpen) {
            infoBoxOpen = false;
        } else {
            infoBoxOpen = true;
        }
    }
}

function openFullscreen() {
    if (fullScreenElement.requestFullscreen) {
        fullScreenElement.requestFullscreen();
    } else if (fullScreenElement.webkitRequestFullScreen) {
        fullScreenElement.webkitRequestFullScreen();
    } else if (fullScreenElement.msRequestFullScreen) {
        fullScreenElement.msRequestFullScreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullScreen();
    }
}

function manageInfoBox() {
    let wOfBox = windowInnerWidth / 5;
    let hOfBox = windowInnerHeight / 1.25;
    let xOfBox = windowInnerWidth - wOfBox;
    let yOfBox = windowInnerHeight / 2 - hOfBox / 2;
    let xOfBoxForLoop;
    if (infoBoxOpen) {
        xOfBoxForLoop = xOfBox;
    } else {
        xOfBoxForLoop = xOfBox + wOfBox;
    }

    let infoBox = allUi["infoBox"];
    infoBox.positionX = xOfBoxForLoop;
    infoBox.positionY = yOfBox;
    infoBox.width = wOfBox;
    infoBox.height = hOfBox;
    infoBox.color = 250;

    let xOfIndicator = xOfBoxForLoop - wOfBox / 10;
    let yOfIndicator = windowInnerHeight / 2 - hOfBox / 10 / 2;
    let wOfIndicator = wOfBox / 10;
    let hOfIndicator = hOfBox / 10;

    let indicator = allUi["indicator"];
    indicator.positionX = xOfIndicator;
    indicator.positionY = yOfIndicator;
    indicator.width = wOfIndicator;
    indicator.height = hOfIndicator;
    indicator.color = 250;
    infoBoxIndicator = [xOfIndicator, yOfIndicator, wOfIndicator, hOfIndicator];

    let wOfBoxElementBox = wOfBox / 1.5;
    let hOfBoxElementBox = hOfBox / 4.5;
    let xOfBoxElementBox = (xOfBoxForLoop + (wOfBox / 2)) - (wOfBoxElementBox / 2);
    let yOfBoxElementBox = yOfBox + 20;

    let infoBoxElementBox = allUi["infoBoxElementBigImageBox"];
    infoBoxElementBox.positionX = xOfBoxElementBox;
    infoBoxElementBox.positionY = yOfBoxElementBox;
    infoBoxElementBox.width = wOfBoxElementBox;
    infoBoxElementBox.height = hOfBoxElementBox;

    let infoBoxElementBoxImg = allUi["infoBoxElementBigImageBoxImg"];
    infoBoxElementBoxImg.image = elementImage[5];
    infoBoxElementBoxImg.positionX = xOfBoxElementBox
    infoBoxElementBoxImg.positionY = yOfBoxElementBox;
    infoBoxElementBoxImg.width = wOfBoxElementBox;
    infoBoxElementBoxImg.height = hOfBoxElementBox;

}

/**
 * @typedef {Object} Class - Just the class
 * @param {BaseSprite} sprite - The instance of the sprite to start from
 * @param {...Class} targetClasses  - The class that you wish to find, example: Tree
 * @returns {Array<Vector>}
 */
function pathFind(sprite, ...targetClasses) {
    const startX = sprite.x;
    const startY = sprite.y;
    const startTile = getTile(startX, startY);
    const tileX = startTile.x;
    const tileY = startTile.y;

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
            if (neighborTile.sprite?.collide(sprite)) continue; // Ignore collision tile

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

    // returns neighbour to all 6 directions, and x and y cannot be lower than 0 and higher than the map size
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const neighbour = createVector(x + dx, y + dy);
            if (inBoundOfGrid(neighbour.x, neighbour.y)) result.push(neighbour);
        }
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