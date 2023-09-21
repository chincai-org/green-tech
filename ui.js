const allUi = [];
const numOfElement = 5;
const numOfElementAddOne = numOfElement + 1;

let elementCoordinate = [];

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
        push();
        textSize(this.textSize);
        fill(this.textColor);
        if (this.textStroke != null) {
            stroke(this.textStroke);
        }
        text(this.text, this.positionX, this.positionY);
        pop();
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

/**
 * Checks if the mouse cursor is over a UI element.
 *
 * @param {Ui} ui - The UI element to check.
 * @returns {boolean} True if the mouse is over the UI element, false otherwise.
 */
function isMouseOverUi(ui) {
    return (
        mouseX < ui.positionX + ui.width &&
        mouseX > ui.positionX &&
        mouseY > ui.positionY &&
        mouseY < ui.positionY + ui.height
    );
}

function isMouseOver(positionX, positionY, width, height) {
    return (
        mouseX < positionX + width &&
        mouseX > positionX &&
        mouseY > positionY &&
        mouseY < positionY + height
    );
}

function drawAllUi() {
    allUi.forEach(ui => {
        ui.draw();
    });
}

function manageUi() {
    mouseOverUi();
    emphasizeSelectedElement();
}

function initUi() {
    elementImage = [
        loadImage("https://placehold.co/64x64/png"),
        loadImage("https://placehold.co/64x65/png"),
        loadImage("https://placehold.co/64x66/png"),
        loadImage("https://placehold.co/64x67/png"),
        loadImage("https://placehold.co/64x68/png"),
        loadImage("https://placehold.co/600x350/png")
    ];

    drawElement();

    drawBar();

    new RectUi(0, 0, 1, 1, 250, "indicator");
    new RectUi(0, 0, 1, 1, 250, "infoBox");

    new RectUi(0, 0, 1, 1, 250, "infoBoxElementBigImageBox");
    new ImgUi(elementImage[0], 0, 1, 1, 1, "infoBoxElementBigImageBoxImg");

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

function drawElement() {
    // Draw Box
    let lengthOfBox = windowInnerWidth / 3;
    let heightOfBox = windowInnerHeight / 10;
    let xOfBox = windowInnerWidth / 2 - lengthOfBox / 2;
    let yOfBox = windowInnerHeight - windowInnerHeight / 5.9;
    new RectUi(xOfBox, yOfBox, lengthOfBox, heightOfBox, "white", "box");

    // Draw Element
    let lengthOfElement = lengthOfBox / numOfElementAddOne;
    let heightOfElement = heightOfBox / 1.2;
    let widthBetweenElement =
        (lengthOfBox - lengthOfElement * numOfElement) / (numOfElement + 1);
    let heightBetweenElement = (heightOfBox - heightOfElement) / 2;
    let xOfElement = xOfBox + widthBetweenElement;
    let yOfElement = yOfBox + heightBetweenElement;

    for (let index = 0; index < numOfElement; index = index + 1) {
        let xOfElementForLoop =
            xOfElement + lengthOfElement * index + index * widthBetweenElement;

        new RectUi(xOfElementForLoop, yOfElement, lengthOfElement, heightOfElement, "white", "element" + index.toString());
        new ImgUi(elementImage[index], xOfElementForLoop, yOfElement, lengthOfElement, heightOfElement, "elementImg" + index.toString());

        elementCoordinate.push({
            xOfElementForLoop,
            yOfElement,
            lengthOfElement,
            heightOfElement
        });
    }
}

function mouseOverUi() {
    // Element
    for (let [index, element] of elementCoordinate.entries()) {
        if (
            isMouseOver(
                element.xOfElementForLoop,
                element.yOfElement,
                element.lengthOfElement,
                element.heightOfElement
            )
        ) {
            let elementUi = getUiByTag("element" + index.toString());
            elementUi.positionX = element.xOfElementForLoop - 10;
            elementUi.positionY = element.yOfElement - 10;
            elementUi.width = element.lengthOfElement + 20;
            elementUi.height = element.heightOfElement + 20;

            let elementImg = getUiByTag("elementImg" + index.toString());
            elementImg.positionX = element.xOfElementForLoop - 10;
            elementImg.positionY = element.yOfElement - 10;
            elementImg.width = element.lengthOfElement + 20;
            elementImg.height = element.heightOfElement + 20;
        } else {
            let elementUi = getUiByTag("element" + index.toString());
            elementUi.positionX = element.xOfElementForLoop;
            elementUi.positionY = element.yOfElement;
            elementUi.width = element.lengthOfElement;
            elementUi.height = element.heightOfElement;

            let elementImg = getUiByTag("elementImg" + index.toString());
            elementImg.positionX = element.xOfElementForLoop;
            elementImg.positionY = element.yOfElement;
            elementImg.width = element.lengthOfElement;
            elementImg.height = element.heightOfElement;
        }
    }
}


function emphasizeSelectedElement() {
    if (hotkey == -1) {
        return;
    } else {
        const element = elementCoordinate[hotkey];

        let elementUi = getUiByTag("element" + (hotkey).toString());

        elementUi.positionX = element.xOfElementForLoop - 10;
        elementUi.positionY = element.yOfElement - 10;
        elementUi.width = element.lengthOfElement + 20;
        elementUi.height = element.heightOfElement + 20;

        let elementImg = getUiByTag("elementImg" + (hotkey).toString());

        elementImg.positionX = element.xOfElementForLoop - 10;
        elementImg.positionY = element.yOfElement - 10;
        elementImg.width = element.lengthOfElement + 20;
        elementImg.height = element.heightOfElement + 20;

    }
}