/** Type definition code heree
 * @typedef {Object} Vector
 * @property {Number} x
 * @property {Number} y
 */

let images = {};

const constWinWidth = 1920;
const constWinHeight = 1080;
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;
let widthRatio = winWidth / constWinWidth;
let heightRatio = winHeight / constWinHeight;

const fullScreenElement = document.documentElement;
const sprites = [];
const refrences = [];
let sprout = null;
const gridWidth = 100;
const gridHeight = 100;
const tileGrid = [];

let tileSize = (constWinWidth * widthRatio) / 30;

let lastUpdate = Date.now();
let debugMode = false;
let camX, camY;
let hotkey = -1;

// tile draw
let startTileX;
let startTileY;
let endTileX;
let endTileY;

let resource = 50;
let energy = 1000;
let pollution = 1000;
let polluteRate = 10;
let lastPollute;

// Game tick
let maxDelta = 4;
const maxDeltaTime = 100;
let delta = 0;
let tickSpeed = 120;
let msBetweenTicks = 1000 / tickSpeed;
let tps = 0;
let ticks = 0;
let lagRecord = false;
let stepamount = 5;
let lastSecond = Date.now();
let lastTick = 0;

let maxPathFindPerTick = 1;

// Game
let respawnableLumberjack = 2;
const gameInitialRockNum = 20;

//debug
let lagRecorded = 0;

function windowResized() {
    let changeInWidth = window.innerWidth / winWidth;
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
    widthRatio = winWidth / constWinWidth;
    heightRatio = winHeight / constWinHeight;
    tileSize = (constWinWidth * widthRatio) / 30;

    for (const refrence of refrences) {
        refrence.collide_range *= changeInWidth;
        refrence.speed *= changeInWidth;
    }
    for (const sprite of sprites) {
        sprite.x *= changeInWidth;
        sprite.y *= changeInWidth;
        sprite.collide_range *= changeInWidth;
        sprite.speed *= changeInWidth;
    }

    resizeCanvas(winWidth, winHeight);
}

function preload() {
    soundFormats("ogg", "wav");
    songData.forEach(song => {
        song.about["object"] = loadSound(song.directory);
    });

    images = {
        tree: loadImage("assets/img/tree.png"),
        lumberjack: loadImage("assets/img/lumberjack.png"),
        sprout_front: loadImage("assets/img/sproutFront.png"),
        sprout_back: loadImage("assets/img/sproutBack.png"),
        sprout_left: loadImage("assets/img/sproutLeft.png"),
        sprout_right: loadImage("assets/img/sproutRight.png")
    };
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

    lastPollute = Date.now();

    sprout = new Sprout(50, 50);
    appendSprite(sprout);

    mapSetup();
}

function mapSetup() {
    for (let i = 0; i < gameInitialRockNum; i++) {
        let randomTile = getTile(
            randint(0, tileSize * gridWidth),
            randint(0, tileSize * gridHeight)
        );
        while (!appendSprite(new Rock(0, 0), randomTile)) {
            randomTile = getTile(
                randint(0, tileSize * gridWidth),
                randint(0, tileSize * gridHeight)
            );
        }
    }
}

function inDrawRange(point, camX, camY) {
    let camViewLeft = camX - windowWidth / 2;
    let camViewRight = camX + windowWidth / 2;
    let camViewTop = camY - windowHeight / 2;
    let camViewBottom = camY + windowHeight / 2;
    if (
        point.x >= camViewLeft - tileSize &&
        point.x <= camViewRight + tileSize &&
        point.y >= camViewTop - tileSize &&
        point.y <= camViewBottom + tileSize
    ) {
        return true;
    }
    return false;
}

function draw() {
    background("#1c6340");

    const now = Date.now();
    let deltaTime = now - lastUpdate;

    // Game tick
    delta += deltaTime / msBetweenTicks;
    if (delta > maxDelta) {
        delta = maxDelta;
    }

    while (delta >= 1) {
        // Resolve pathfinding
        PathFindClient.resolve(maxPathFindPerTick);
        gameTick();
        ticks++;
        delta--;
    }

    let lumberjackCount = 0;
    for (const sprite of sprites) {
        if (sprite instanceof Lumberjack) {
            lumberjackCount++;
        }
    }

    // lumberjack respawn
    let center = { x: sprout.x, y: sprout.y };
    for (let i = lumberjackCount; i < respawnableLumberjack; i++) {
        // attempt to append new lumberjack
        while (
            !appendSprite(
                new Lumberjack(
                    center.x +
                        randint(
                            -Lumberjack.pathFindRange * tileSize,
                            Lumberjack.pathFindRange * tileSize
                        ),
                    center.y +
                        randint(
                            -Lumberjack.pathFindRange * tileSize,
                            Lumberjack.pathFindRange * tileSize
                        )
                )
            )
        );
    }

    const timePassed = Date.now() - lastSecond;
    if (timePassed >= 1000) {
        const tickPassed = ticks - lastTick;
        const tps = ((tickPassed / timePassed) * 1000).toFixed(2);
        const lag = (tickSpeed - tps).toFixed(2);
        const lagPerLumberjack = (lag / lumberjackCount).toFixed(2);

        lagRecorded = lag;

        // recording lag
        if (lagRecord) {
            console.log(
                `TPS: ${tps} LumberjackCount: ${lumberjackCount} Lag: ${lag} Lag/Lum: ${lagPerLumberjack}`
            );
            const lagPercent = (lag / tickSpeed) * 100;
            if (lagPercent > 80) {
                console.log(
                    `Lag->80% tickSpeed stepamount: ${stepamount} maxDelta: ${maxDelta} range: ${Lumberjack.pathFindRange}`
                );
                console.log("Reached number of lumberjack: ", lumberjackCount);
                lagRecord = false;
            }
            for (let i = 0; i < stepamount; i++) {
                // attempt to append new lumberjack
                while (
                    !appendSprite(
                        new Lumberjack(
                            center.x +
                                randint(
                                    -Lumberjack.pathFindRange * tileSize,
                                    Lumberjack.pathFindRange * tileSize
                                ),
                            center.y +
                                randint(
                                    -Lumberjack.pathFindRange * tileSize,
                                    Lumberjack.pathFindRange * tileSize
                                )
                        )
                    )
                );
            }
        }
        lastSecond = Date.now();
        lastTick = ticks;
    }

    drawGridLine();

    for (const sprite of sprites) {
        if (inDrawRange(sprite, camX, camY)) {
            sprite.draw();
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

    if (debugMode) {
        text("lag: " + lagRecorded, windowWidth - 200, 20);
    }
}

function gameTick() {
    for (const sprite of sprites) {
        sprite.tick();
    }
}

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

function spendResourcesToPlace(amount, sprite, tile = null) {
    if (resource >= amount && appendSprite(sprite, tile)) {
        resource -= amount;
    }
}

function canvasClicked() {
    let disX = windowWidth / 2 - mouseX;
    let disY = windowHeight / 2 - mouseY;

    let realX = camX - disX;
    let realY = camY - disY;

    let tile = getTile(realX, realY);

    switch (hotkey) {
        case 0:
            spendResourcesToPlace(2, new Tree(0, 0), tile);
            break;
        case 1:
            spendResourcesToPlace(50, new PoliceStation(0, 0), tile);
            break;
        case 2:
            appendSprite(new Lumberjack(realX, realY));
            break;
        case 3:
            spendResourcesToPlace(10, new Rock(0, 0), tile);
            break;
        default:
            return;
    }
}

function appendSprite(sprite, tile = null) {
    if (sprite instanceof DebugSprite) {
        return;
    }
    if (!inBoundOfMap(sprite.x, sprite.y)) {
        return false;
    }
    if (tile) {
        sprite.x = (tile.x + 0.5) * tileSize;
        sprite.y = (tile.y + 0.5) * tileSize;
    }

    if (sprite.isCollidingAnySprite() || tile?.sprite != null) {
        console.info("cannot append sprite, colliding with other sprite");
        return false;
    } else {
        if (tile) {
            tile.add(sprite);
        }
        sprite.tile = getTile(sprite.x, sprite.y);
        sprites.push(sprite);

        sprite.checkMapChange(true);
        return true;
    }
}

function unappendSprite(sprite) {
    if (sprite instanceof DebugSprite) {
        return;
    }

    sprites.splice(sprites.indexOf(sprite), 1);

    if (sprite.onTile) {
        sprite.tile.remove();
    }

    if (sprite.pathFindClient) {
        sprite.pathFindClient.invalid = true;
    }
    sprite.checkMapChange(true, true);
}

// empty every sprite except sprout
function resetSprites() {
    for (const sprite of sprites) {
        if (sprite.onTile) {
            sprite.tile.remove();
        }

        if (sprite.pathFindClient) {
            sprite.pathFindClient.invalid = true;
        }

        sprite.checkMapChange(true, true);
    }
    sprites.length = 0;
    appendSprite(sprout);
    sprout.checkMapChange(true);
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
    return tileX >= 0 && tileX < gridWidth && tileY >= 0 && tileY < gridHeight;
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
    stroke(0);
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

function lagProfileTest(
    steps = null,
    _maxDelta = null,
    _tickSpeed = null,
    range = null
) {
    resetSprites();
    lagRecord = true;
    stepamount = steps || stepamount;
    maxDelta = _maxDelta || maxDelta;
    tickSpeed = _tickSpeed || tickSpeed;
    msBetweenTicks = 1000 / tickSpeed;
    Lumberjack.pathFindRange = range || Lumberjack.pathFindRange;

    let centerTileCoord = { x: gridWidth / 2, y: gridHeight / 2 };
    let center = centerFromCoord(centerTileCoord.x, centerTileCoord.y);
    sprout.x = center.x;
    sprout.y = center.y;
    let neighbours = getTile(center.x, center.y).neighbour();
    for (const neighbour of neighbours) {
        let rock = new Rock(0, 0);
        rock.collide_range = (tileSize / 2) * 0.9;
        appendSprite(rock, tileGrid[neighbour.y][neighbour.x]);
    }
    return "Test started until reached 80% lag";
}

function testOccupied() {
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            for (const sprite of tileGrid[y][x].occupied) {
                if (sprite instanceof Sprout) {
                    sprites.push(
                        new DebugSprite(
                            tileGrid[y][x].center().x,
                            tileGrid[y][x].center().y
                        )
                    );
                }
            }
        }
    }
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
