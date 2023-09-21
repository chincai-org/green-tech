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

    draw() {
        fill(this.color);
        rect(this.positionX, this.positionY, this.width, this.height);
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

    draw() {
        image(this.image, this.positionX, this.positionY, this.width, this.height);
    }
}
class TextUi extends Ui {
    constructor(text, positionX, positionY, textSize, textColor, tag = "not set") {
        super(positionX, positionY);
        this.text = text;
        this.textSize = textSize;
        this.textColor = textColor;
        this.tag = tag;

        this.textStroke = null;
    }

    draw() {
        push(); // Save the current drawing style
        textSize(this.textSize);
        fill(this.textColor);
        if (this.textStroke != null) {
            stroke(this.textStroke);
        }
        text(this.text, this.positionX, this.positionY);
        pop(); // Restore the previous drawing style
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
        ui.draw();
    });
}

function initUi() {
    let tempImage = loadImage("https://placehold.co/64x64/png");
    new RectUi(0, 0, 1, 1, "white", "box");
    for (let index = 0; index < numOfElement; index = index + 1) {
        new RectUi(0, 0, 1, 1, "white", "element" + index.toString());
        new ImgUi(tempImage, 0, 0, 1, 1, "elementImg" + index.toString());
    }


    for (let loopBar = 0; loopBar < barValue.length; loopBar = loopBar + 1) {
        new RectUi(0, 0, 1, 1, "white", "bar" + loopBar.toString() + "1");
        new RectUi(0, 0, 1, 1, "white", "bar" + loopBar.toString() + "2");
        new TextUi("", 0, 0, 1, 250, "barInnerText" + loopBar.toString());
        new TextUi("", 0, 0, 1, 250, "barValueText" + loopBar.toString())
    }

    new RectUi(0, 0, 1, 1, 250, "indicator");
    new RectUi(0, 0, 1, 1, 250, "infoBox");

    new RectUi(0, 0, 1, 1, 250, "infoBoxElementBigImageBox");
    new ImgUi(tempImage, 0, 1, 1, 1, "infoBoxElementBigImageBoxImg");

    new TextUi("", 0, 0, 1, 250, "resource");
}