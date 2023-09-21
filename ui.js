const allUi = [];

let barValue = [
    {
        barName: "carbonEmissionBar",
        innerText: "Carbon Emission",
        display: true,
        min: 0,
        max: 1000,
        displayValueAndMax: true,
        displayInnerText: true,
        value: 600,
        backgroundColor: "magenta",
        fillColor: "cyan",
        valueMaxColor: "black",
        innerTextColor: "black",
        barTextSize: 10
    },
    {
        barName: "carbonEmissionBar",
        innerText: "Carbon Emission",
        display: true,
        min: 0,
        max: 1000,
        displayValueAndMax: true,
        displayInnerText: true,
        value: 600,
        backgroundColor: "magenta",
        fillColor: "cyan",
        valueMaxColor: "black",
        innerTextColor: "black",
        barTextSize: 10
    },
    {
        barName: "carbonEmissionBar",
        innerText: "Carbon Emission",
        display: true,
        min: 0,
        max: 1000,
        displayValueAndMax: true,
        displayInnerText: true,
        value: 600,
        backgroundColor: "magenta",
        fillColor: "cyan",
        valueMaxColor: "black",
        innerTextColor: "black",
        barTextSize: 10
    }
];

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

function updateUi() {
    // Update Ui
}

function initUi() {
    let tempImage = loadImage("https://placehold.co/64x64/png");
    new RectUi(0, 0, 1, 1, "white", "box");
    for (let index = 0; index < numOfElement; index = index + 1) {
        new RectUi(0, 0, 1, 1, "white", "element" + index.toString());
        new ImgUi(tempImage, 0, 0, 1, 1, "elementImg" + index.toString());
    }


    drawBar();

    new RectUi(0, 0, 1, 1, 250, "indicator");
    new RectUi(0, 0, 1, 1, 250, "infoBox");

    new RectUi(0, 0, 1, 1, 250, "infoBoxElementBigImageBox");
    new ImgUi(tempImage, 0, 1, 1, 1, "infoBoxElementBigImageBoxImg");

    new TextUi("", 0, 0, 1, 250, "resource");
}


function drawBar() {
    let xOfBar = windowInnerWidth / 50;
    let yOfBar = windowInnerHeight / 50;
    let heightBetweenBar = windowInnerHeight / 50;
    let lengthOfBar = windowInnerWidth / 3;
    let heightOfBar = 10;
    let hideBar = 0;
    for (let [loopBar, barItem] of barValue.entries()) {
        if (!barItem.display) {
            barValue.splice(loopBar, 1);
        }
    }
    for (let [loopBar, barItem] of barValue.entries()) {
        let yOfBarForLoop =
            yOfBar +
            heightOfBar * (loopBar - hideBar) +
            heightBetweenBar * (loopBar - hideBar);
        let lengthOfBarForLoop =
            (lengthOfBar / (barItem.max - barItem.min)) * barItem.value;


        new RectUi(xOfBar, yOfBarForLoop, lengthOfBar, heightOfBar, barItem.backgroundColor, "bar" + loopBar + "1");
        new RectUi(xOfBar, yOfBarForLoop, lengthOfBarForLoop, heightOfBar, barItem.fillColor, "bar" + loopBar + "2");

        let xOfInnerText = xOfBar + lengthOfBar / 2;
        let yOfInnerText = yOfBarForLoop + 9;
        if (barItem.displayValueAndMax) {
            new TextUi(barItem.value + "/" + barItem.max,
                xOfInnerText + 11, yOfInnerText,
                barItem.barTextSize,
                barItem.valueMaxColor,
                "barInnerText" + loopBar
            );
        }
        if (barItem.displayInnerText) {
            new TextUi(barItem.innerText,
                xOfBar + 2, yOfInnerText,
                barItem.barTextSize,
                barItem.innerTextColor,
                "barValueText" + loopBar
            );
        }
    }
}