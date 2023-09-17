const initialWinWidth = window.innerWidth;
const initialWinHeight = window.innerHeight;
const grid = [];
const movables = [];
const sprout = new Sprout(0, 0);
const gridWidth = 100;
const gridHeight = 100;
const tileGrid = [];
const initialTileSize = initialWinWidth / 30;
let tileSize = initialWinWidth / 30;

let lastUpdate = Date.now();
let deltaTime;
let displayCoord = false;
let camX, camY;
let hotkey = 0;

var windowInnerWidth = window.innerWidth
var windowInnerHeight = window.innerHeight
var elementSelected = -1;
var elementCoordinate =[];
const numOfElement = 5;
const numOfElementAddOne = numOfElement + 1;
let elementImage = []; 
var barValue = 
[
  {
    "barName": "carbonEmissionBar",
    "innerText": "Carbon Emission",
    "display": true,
    "min": 0,
    "max": 1000,
    "displayValueAndMax": true, 
    "displayInnerText": true,
    "value": 600,
    "backgroundColor": "magenta",
    "fillColor": "cyan",
    "valueMaxColor": "black",
    "innerTextColor": "black"

  }, 
  {
    "barName": "carbonEmissionBar",
    "innerText": "Carbon Emission",
    "display": true,
    "min": 0,
    "max": 1000,
    "displayValueAndMax": true, 
    "displayInnerText": true,
    "value": 600,
    "backgroundColor": "magenta",
    "fillColor": "cyan",
    "valueMaxColor": "black",
    "innerTextColor": "black"

  },{
    "barName": "carbonEmissionBar",
    "innerText": "Carbon Emission",
    "display": true,
    "min": 0,
    "max": 1000,
    "displayValueAndMax": true, 
    "displayInnerText": true,
    "value": 600,
    "backgroundColor": "magenta",
    "fillColor": "cyan",
    "valueMaxColor": "black",
    "innerTextColor": "black"

  }
];

function windowResized() {
    console.log("resized");
    tileSize = windowWidth / 30;
    sprout.speed = window.innerWidth / 30 / (initialWinWidth / 15);
    resizeCanvas(windowWidth, windowHeight);

    windowInnerWidth = window.innerWidth
    windowInnerHeight = window.innerHeight
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

    elementImage[0] = loadImage("https://placehold.co/64x64/png"); 
    elementImage[1] = loadImage("https://placehold.co/64x65/png"); 
    elementImage[2] = loadImage("https://placehold.co/64x66/png"); 
    elementImage[3] = loadImage("https://placehold.co/64x67/png"); 
    elementImage[4] = loadImage("https://placehold.co/64x68/png"); 
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

    lastUpdate = now;

    manageBox();
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
    } else if (keyCode === 76) {
        hotkey = 76;
    }
}

function canvasClicked() {
    let disX = windowWidth / 2 - mouseX;
    let disY = windowHeight / 2 - mouseY;

    let realX = camX - disX;
    let realY = camY - disY;

    let tile = getTile(realX, realY);

    if (hotkey === 84) {
        tile.add(new Tree(0, 0));
    } else if (hotkey === 80) {
        tile.add(new PoliceStation(0, 0));
    } else if (hotkey === 76) {
        movables.push(
            new Lumberjack(
                mouseX + camX - windowWidth / 2,
                mouseY + camY - windowHeight / 2
            )
        );
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

function getTile(x, y) {
    return tileGrid[Math.floor(y / tileSize)][Math.floor(x / tileSize)];
}

function manageBox() {
    var drawBoxReturn = drawBox();
    drawBar();
    drawElement(drawBoxReturn[0], drawBoxReturn[1], drawBoxReturn[2], drawBoxReturn[3]);
    mouseOverElement();
    emphasizeSelectedElement();
}

function drawBox() {
  var lengthOfBox = windowInnerWidth / 3;
  var heightOfBox = windowInnerHeight / 10;
  var xOfBox = (windowInnerWidth / 2) - (lengthOfBox / 2);
  var yOfBox = windowInnerHeight - (windowInnerHeight / 5.9);
  rect(xOfBox, yOfBox, lengthOfBox, heightOfBox);
  
  return [xOfBox, yOfBox, lengthOfBox, heightOfBox];
}

function drawElement(xob, yob, lob, hob) {
  var lengthOfElement = lob / numOfElementAddOne
  var heightOfElement = hob / 1.2;
  var widthBetweenElement = (lob - (lengthOfElement * numOfElement)) / (numOfElement + 1);
  var heightBetweenElement = (hob - heightOfElement) / 2;
  var xOfElement = xob + widthBetweenElement;
  var yOfElement = yob + heightBetweenElement;
  elementCoordinate = [];
  
  for (var loopElement = 0; loopElement < numOfElement; loopElement = loopElement + 1) {
    var xOfElementForLoop = xOfElement + (lengthOfElement * loopElement) + (loopElement * widthBetweenElement);
    rect(xOfElementForLoop, yOfElement, lengthOfElement, heightOfElement);
    image(elementImage[loopElement], xOfElementForLoop, yOfElement, lengthOfElement, heightOfElement);
    
    elementCoordinate.push({xOfElementForLoop, yOfElement, lengthOfElement, heightOfElement});
  }
}

function mousePressed() {
  for (var loopElement = 0; loopElement < numOfElement; loopElement = loopElement + 1) {
    if ((mouseX < elementCoordinate[loopElement].xOfElementForLoop + elementCoordinate[loopElement].lengthOfElement) && (mouseX > elementCoordinate[loopElement].xOfElementForLoop) && (mouseY > elementCoordinate[loopElement].yOfElement) && (mouseY < elementCoordinate[loopElement].yOfElement + elementCoordinate[loopElement].heightOfElement)) {
      if (elementSelected == loopElement) {
        elementSelected = -1;
      } else {

      
      elementSelected = loopElement;
        console.log(loopElement);
      }
    } 
  } 
}

function mouseOverElement() {
  for (var loopElement = 0; loopElement < numOfElement; loopElement = loopElement + 1) {
    if ((mouseX < elementCoordinate[loopElement].xOfElementForLoop + elementCoordinate[loopElement].lengthOfElement) && (mouseX > elementCoordinate[loopElement].xOfElementForLoop) && (mouseY > elementCoordinate[loopElement].yOfElement) && (mouseY < elementCoordinate[loopElement].yOfElement + elementCoordinate[loopElement].heightOfElement)) {
      console.log(loopElement)
      rect(elementCoordinate[loopElement].xOfElementForLoop - 10, elementCoordinate[loopElement].yOfElement - 10, elementCoordinate[loopElement].lengthOfElement + 20, elementCoordinate[loopElement].heightOfElement + 20);
      image(elementImage[loopElement], elementCoordinate[loopElement].xOfElementForLoop - 10, elementCoordinate[loopElement].yOfElement - 10, elementCoordinate[loopElement].lengthOfElement + 20, elementCoordinate[loopElement].heightOfElement + 20);
      
    } 
  } 
}

function emphasizeSelectedElement() {
  if (elementSelected == -1) {
    return
  } else {
    rect(elementCoordinate[elementSelected].xOfElementForLoop - 10, elementCoordinate[elementSelected].yOfElement - 10, elementCoordinate[elementSelected].lengthOfElement + 20, elementCoordinate[elementSelected].heightOfElement + 20);
    
    image(elementImage[elementSelected], elementCoordinate[elementSelected].xOfElementForLoop - 10, elementCoordinate[elementSelected].yOfElement - 10, elementCoordinate[elementSelected].lengthOfElement + 20, elementCoordinate[elementSelected].heightOfElement + 20);

  }
}

function drawBar() {
  var xOfBar = windowInnerWidth / 50;
  var yOfBar = windowInnerHeight / 50;
  var heightBetweenBar = windowInnerHeight / 50;
  var lengthOfBar = windowInnerWidth / 3;
  var heightOfBar = 10;
  var hideBar = 0;
  for (var loopBar = 0; loopBar < barValue.length; loopBar = loopBar + 1) {
    if (!barValue[loopBar].display) {
      barValue.splice(loopBar, 1);
    }
  }
  for (var loopBar = 0; loopBar < barValue.length; loopBar = loopBar + 1) {

    var yOfBarForLoop = yOfBar + (heightOfBar * (loopBar - hideBar)) + (heightBetweenBar * (loopBar - hideBar));
    var lengthOfBarForLoop = (lengthOfBar / (barValue[loopBar].max - barValue[loopBar].min)) * barValue[loopBar].value;
    fill(barValue[loopBar].backgroundColor);
    rect(xOfBar, yOfBarForLoop, lengthOfBar, heightOfBar);
    fill(barValue[loopBar].fillColor);
    rect(xOfBar, yOfBarForLoop, lengthOfBarForLoop, heightOfBar);

    var xOfInnerText = xOfBar + (lengthOfBar / 2);
    var yOfInnerText = yOfBarForLoop + 9;
    if (barValue[loopBar].displayValueAndMax) {
      fill(barValue[loopBar].valueMaxColor);
      text(barValue[loopBar].value + "/" + barValue[loopBar].max, xOfInnerText + 11, yOfInnerText);
    }
    if (barValue[loopBar].displayInnerText) {
      fill(barValue[loopBar].innerTextColor);
      text(barValue[loopBar].innerText, xOfBar + 2, yOfInnerText);
    }
  }
  fill(250)
}

var fullScreenElement = document.documentElement;
function openFullscreen() {
  if (fullScreenElement.requestFullscreen) {
    fullScreenElement.requestFullscreen();

  } else if (fullScreenElement.webkitRequestFullScreen) {
    fullScreenElement.webkitRequestFullScreen()
  } else if (fullScreenElement.msRequestFullScreen) {
    fullScreenElement.msRequestFullScreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullScreen();
  }
}

function drawBox() {
  var lengthOfBox = windowInnerWidth / 3;
  var heightOfBox = windowInnerHeight / 10;
  var xOfBox = (windowInnerWidth / 2) - (lengthOfBox / 2);
  var yOfBox = windowInnerHeight - (windowInnerHeight / 5.9);
  rect(xOfBox, yOfBox, lengthOfBox, heightOfBox);
  
  return [xOfBox, yOfBox, lengthOfBox, heightOfBox];
}

function drawElement(xob, yob, lob, hob) {
  var lengthOfElement = lob / numOfElementAddOne
  var heightOfElement = hob / 1.2;
  var widthBetweenElement = (lob - (lengthOfElement * numOfElement)) / (numOfElement + 1);
  var heightBetweenElement = (hob - heightOfElement) / 2;
  var xOfElement = xob + widthBetweenElement;
  var yOfElement = yob + heightBetweenElement;
  elementCoordinate = [];
  
  for (var loopElement = 0; loopElement < numOfElement; loopElement = loopElement + 1) {
    var xOfElementForLoop = xOfElement + (lengthOfElement * loopElement) + (loopElement * widthBetweenElement);
    rect(xOfElementForLoop, yOfElement, lengthOfElement, heightOfElement);
    image(elementImage[loopElement], xOfElementForLoop, yOfElement, lengthOfElement, heightOfElement);
    
    elementCoordinate.push({xOfElementForLoop, yOfElement, lengthOfElement, heightOfElement});
  }
}

function mousePressed() {
  for (var loopElement = 0; loopElement < numOfElement; loopElement = loopElement + 1) {
    if ((mouseX < elementCoordinate[loopElement].xOfElementForLoop + elementCoordinate[loopElement].lengthOfElement) && (mouseX > elementCoordinate[loopElement].xOfElementForLoop) && (mouseY > elementCoordinate[loopElement].yOfElement) && (mouseY < elementCoordinate[loopElement].yOfElement + elementCoordinate[loopElement].heightOfElement)) {
      if (elementSelected == loopElement) {
        elementSelected = -1;
      } else {

      
      elementSelected = loopElement;
        console.log(loopElement);
      }
    } 
  } 
}

function mouseOverElement() {
  for (var loopElement = 0; loopElement < numOfElement; loopElement = loopElement + 1) {
    if ((mouseX < elementCoordinate[loopElement].xOfElementForLoop + elementCoordinate[loopElement].lengthOfElement) && (mouseX > elementCoordinate[loopElement].xOfElementForLoop) && (mouseY > elementCoordinate[loopElement].yOfElement) && (mouseY < elementCoordinate[loopElement].yOfElement + elementCoordinate[loopElement].heightOfElement)) {
      console.log(loopElement)
      rect(elementCoordinate[loopElement].xOfElementForLoop - 10, elementCoordinate[loopElement].yOfElement - 10, elementCoordinate[loopElement].lengthOfElement + 20, elementCoordinate[loopElement].heightOfElement + 20);
      image(elementImage[loopElement], elementCoordinate[loopElement].xOfElementForLoop - 10, elementCoordinate[loopElement].yOfElement - 10, elementCoordinate[loopElement].lengthOfElement + 20, elementCoordinate[loopElement].heightOfElement + 20);
      
    } 
  } 
}

function emphasizeSelectedElement() {
  if (elementSelected == -1) {
    return
  } else {
    rect(elementCoordinate[elementSelected].xOfElementForLoop - 10, elementCoordinate[elementSelected].yOfElement - 10, elementCoordinate[elementSelected].lengthOfElement + 20, elementCoordinate[elementSelected].heightOfElement + 20);
    
    image(elementImage[elementSelected], elementCoordinate[elementSelected].xOfElementForLoop - 10, elementCoordinate[elementSelected].yOfElement - 10, elementCoordinate[elementSelected].lengthOfElement + 20, elementCoordinate[elementSelected].heightOfElement + 20);

  }
}

function drawBar() {
  var xOfBar = windowInnerWidth / 50;
  var yOfBar = windowInnerHeight / 50;
  var heightBetweenBar = windowInnerHeight / 50;
  var lengthOfBar = windowInnerWidth / 3;
  var heightOfBar = 10;
  var hideBar = 0;
  for (var loopBar = 0; loopBar < barValue.length; loopBar = loopBar + 1) {
    if (!barValue[loopBar].display) {
      barValue.splice(loopBar, 1);
    }
  }
  for (var loopBar = 0; loopBar < barValue.length; loopBar = loopBar + 1) {

    var yOfBarForLoop = yOfBar + (heightOfBar * (loopBar - hideBar)) + (heightBetweenBar * (loopBar - hideBar));
    var lengthOfBarForLoop = (lengthOfBar / (barValue[loopBar].max - barValue[loopBar].min)) * barValue[loopBar].value;
    fill(barValue[loopBar].backgroundColor);
    rect(xOfBar, yOfBarForLoop, lengthOfBar, heightOfBar);
    fill(barValue[loopBar].fillColor);
    rect(xOfBar, yOfBarForLoop, lengthOfBarForLoop, heightOfBar);

    var xOfInnerText = xOfBar + (lengthOfBar / 2);
    var yOfInnerText = yOfBarForLoop + 9;
    if (barValue[loopBar].displayValueAndMax) {
      fill(barValue[loopBar].valueMaxColor);
      text(barValue[loopBar].value + "/" + barValue[loopBar].max, xOfInnerText + 11, yOfInnerText);
    }
    if (barValue[loopBar].displayInnerText) {
      fill(barValue[loopBar].innerTextColor);
      text(barValue[loopBar].innerText, xOfBar + 2, yOfInnerText);
    }
  }
  fill(250)
}

var fullScreenElement = document.documentElement;
function openFullscreen() {
  if (fullScreenElement.requestFullscreen) {
    fullScreenElement.requestFullscreen();

  } else if (fullScreenElement.webkitRequestFullScreen) {
    fullScreenElement.webkitRequestFullScreen()
  } else if (fullScreenElement.msRequestFullScreen) {
    fullScreenElement.msRequestFullScreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullScreen();
  }
}

