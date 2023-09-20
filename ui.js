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


function getUIByTag(tag) {
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

function drawAllUi() {
    allUi.forEach(ui => {
        //cheak for type first eg. rect
        fill(ui.color);
        rect(ui.positionX, ui.positionY, ui.width, ui.height);
    });
}

function initUi() {
    new RectUi(0, 0, 0, 0, "white", "box");
    for (let index = 0; index < numOfElement; index = index + 1) {
        new RectUi(0, 0, 0, 0, "white", index.toString());
    }
    for (let loopBar = 0; loopBar < barValue.length; loopBar = loopBar + 1) {
        new RectUi(0, 0, 0, 0, "white", "bar" + loopBar.toString() + "1");
        new RectUi(0, 0, 0, 0, "white", "bar" + loopBar.toString() + "2");
    }

    new RectUi(0, 0, 0, 0, 250, "indicator");
    new RectUi(0, 0, 0, 0, 250, "infoBox");
}

/*
TODO: picture and text...
*/