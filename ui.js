const allUi = [];

class Ui {
    constructor(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;

        allUi.push(this);
    }
}

class RectUi extends Ui {
    constructor(positionX, positionY, width, height, color = "white", tag = "not set") {
        super(positionX, positionY);

        this.width = width;
        this.height = height;
        this.color = color;
        this.tag = tag;
    }
}

class ImgUi extends Ui {
    constructor(image, positionX, positionY, width, height, tag = "not set") {
        super(positionX, positionY);

        this.image = image;
        this.width = width;
        this.height = height;
        this.tag = tag;
    }
}


function getUiByTag(tag) {
    return allUi.find(ui => ui.tag === tag);
}

function isMouseOnAnyUi() {
    return allUi.some(
        ui =>
            mouseX < ui.positionX + ui.width &&
            mouseX > ui.positionX &&
            mouseY > ui.positionY &&
            mouseY < ui.positionY + ui.height
    );
}

function isMouseOverUi(tag) {
    let ui = getUiByTag(tag);
    return (
        mouseX < ui.positionX + ui.width &&
        mouseX > ui.positionX &&
        mouseY > ui.positionY &&
        mouseY < ui.positionY + ui.height
    );
}

function drawAllUi() {
    allUi.forEach(ui => {
        if (ui instanceof RectUi) {
            fill(ui.color);
            rect(ui.positionX, ui.positionY, ui.width, ui.height);
        } else if (ui instanceof ImgUi) {
            image(ui.image, ui.positionX, ui.positionY, ui.width, ui.height);
        }
    });
}

function initUi() {
    let tempImg64x64 = loadImage("https://placehold.co/64x64/png");
    let tempImg600x350 = loadImage("https://placehold.co/600x350/png");
    new RectUi(0, 0, 1, 1, "white", "box");
    for (let index = 0; index < numOfElement; index = index + 1) {
        new RectUi(0, 0, 1, 1, "white", "element" + index.toString());
        new ImgUi(tempImg64x64, 0, 0, 1, 1, "elementImg" + index.toString());
    }


    for (let loopBar = 0; loopBar < barValue.length; loopBar = loopBar + 1) {
        new RectUi(0, 0, 1, 1, "white", "bar" + loopBar.toString() + "1");
        new RectUi(0, 0, 1, 1, "white", "bar" + loopBar.toString() + "2");
    }

    new RectUi(0, 0, 1, 1, 250, "indicator");
    new RectUi(0, 0, 1, 1, 250, "infoBox");

    new RectUi(0, 0, 1, 1, 250, "infoBoxElementBigImageBox");
    new ImgUi(tempImg600x350, 0, 1, 1, 1, "infoBoxElementBigImageBoxImg"); 
}

/*
TODO: picture and text...
*/