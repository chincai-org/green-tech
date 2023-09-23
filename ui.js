const allUi = {};
const numOfElement = 5;
const numOfElementAddOne = numOfElement + 1;

let infoBoxOpen = false;

let barValue = [
    {
        barName: "resourcesBar",
        innerText: "Resources",
        display: true,
        min: 0,
        max: 1000,
        displayValueAndMax: true,
        displayInnerText: true,
        value: resource,
        backgroundColor: "magenta",
        fillColor: "cyan",
        valueMaxColor: "black",
        innerTextColor: "black",
        barTextSize: 15
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
        barTextSize: 15
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
        barTextSize: 15
    }
];

class Ui {
    constructor(positionX, positionY, tag) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.tag = tag;

        allUi[tag] = this;
    }
}

class RectUi extends Ui {
    constructor(
        positionX,
        positionY,
        width,
        height,
        color = "white",
        tag = "not set"
    ) {
        super(positionX, positionY, tag);

        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        fill(this.color);
        rect(this.positionX, this.positionY, this.width, this.height);
    }
}

class ImgUi extends Ui {
    constructor(image, positionX, positionY, width, height, tag = "not set") {
        super(positionX, positionY, tag);

        this.image = image;
        this.width = width;
        this.height = height;
    }

    draw() {
        image(
            this.image,
            this.positionX,
            this.positionY,
            this.width,
            this.height
        );
    }
}
class TextUi extends Ui {
    constructor(
        text,
        positionX,
        positionY,
        textSize,
        textColor,
        tag = "not set"
    ) {
        super(positionX, positionY, tag);
        this.text = text;
        this.textSize = textSize;
        this.textColor = textColor;

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

function isMouseOnAnyUi() {
    for (let tag in allUi) {
        const ui = allUi[tag];
        if (
            mouseX < ui.positionX + ui.width &&
            mouseX > ui.positionX &&
            mouseY > ui.positionY &&
            mouseY < ui.positionY + ui.height
        ) {
            return true;
        }
    }
    return false;
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
    for (let tag in allUi) {
        allUi[tag].draw();
    }
}

function updateUi() {
    manageBar();
    manageElement();
    manageInfoBox();
    manageResourceText();
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

    for (let [loopBar, barItem] of barValue.entries()) {
        new RectUi(0, 0, 0, 0, barItem.backgroundColor, "bar" + loopBar + "1");
        new RectUi(0, 0, 0, 0, barItem.fillColor, "bar" + loopBar + "2");
        new TextUi(
            barItem.value + "/" + barItem.max,
            0,
            0,
            barItem.barTextSize,
            barItem.valueMaxColor,
            "barValueText" + loopBar
        );
        new TextUi(
            barItem.innerText,
            0,
            0,
            barItem.barTextSize,
            barItem.innerTextColor,
            "barInnerText" + loopBar
        );
    }

    new RectUi(0, 0, 0, 0, "white", "box");
    for (let index = 0; index < numOfElement; index = index + 1) {
        new RectUi(0, 0, 0, 0, "white", "element" + index.toString());
        new ImgUi(
            elementImage[index],
            0,
            0,
            0,
            0,
            "elementImg" + index.toString()
        );
    }

    new RectUi(0, 0, 1, 1, 250, "indicator");
    new RectUi(0, 0, 1, 1, 250, "infoBox");

    new RectUi(0, 0, 1, 1, 250, "infoBoxElementBigImageBox");
    new ImgUi(elementImage[0], 0, 1, 1, 1, "infoBoxElementBigImageBoxImg");

    new TextUi("", 0, 0, 20, 250, "resource");
    allUi["resource"].textStroke = "#f5f5dc";

    for (let index0 = 0; index0 < 3; index0 = index0 + 1) {
        for (let index = 0; index < 3; index = index + 1) {
            new RectUi(0, 1, 1, 1, 250, "infoBoxElementLevel" + index0.toString() + "-" + index.toString());
        }
    } 

}

function manageBar() {
    // Resources change
    barValue[0].value = resource;

    let xOfBar = windowWidth / 50;
    let yOfBar = windowHeight / 50;
    let heightBetweenBar = windowHeight / 50;
    let lengthOfBar = windowWidth / 3;
    let heightOfBar = 15;
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
        allUi["bar" + loopBar + "1"].positionX = xOfBar;
        allUi["bar" + loopBar + "1"].positionY = yOfBarForLoop;
        allUi["bar" + loopBar + "1"].width = lengthOfBar;
        allUi["bar" + loopBar + "1"].height = heightOfBar;

        allUi["bar" + loopBar + "2"].positionX = xOfBar;
        allUi["bar" + loopBar + "2"].positionY = yOfBarForLoop;
        allUi["bar" + loopBar + "2"].width = lengthOfBarForLoop;
        allUi["bar" + loopBar + "2"].height = heightOfBar;

        let xOfInnerText = xOfBar + lengthOfBar / 2 - 50;
        let yOfInnerText = yOfBarForLoop + 12;
        if (barItem.displayInnerText) {
            allUi["barInnerText" + loopBar].positionX = xOfInnerText + 11;
            allUi["barInnerText" + loopBar].positionY = yOfInnerText;
        }
        if (barItem.displayValueAndMax) {
            allUi["barValueText" + loopBar].text =
                barItem.value + "/" + barItem.max;
            allUi["barValueText" + loopBar].positionX = xOfBar + 2;
            allUi["barValueText" + loopBar].positionY = yOfInnerText;
        }
    }
}

function manageElement() {
    // Draw Box
    let lengthOfBox = windowWidth / 3;
    let heightOfBox = windowHeight / 10;
    let xOfBox = windowWidth / 2 - lengthOfBox / 2;
    let yOfBox = windowHeight - windowHeight / 5.9;
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

        allUi["element" + index].positionX = xOfElementForLoop;
        allUi["element" + index].positionY = yOfElement;
        allUi["element" + index].width = lengthOfElement;
        allUi["element" + index].height = heightOfElement;

        allUi["elementImg" + index].positionX = xOfElementForLoop;
        allUi["elementImg" + index].positionY = yOfElement;
        allUi["elementImg" + index].width = lengthOfElement;
        allUi["elementImg" + index].height = heightOfElement;

        // When mouse over
        if (
            isMouseOver(
                xOfElementForLoop,
                yOfElement,
                lengthOfElement,
                heightOfElement
            )
        ) {
            allUi["element" + index].positionX = xOfElementForLoop - 10;
            allUi["element" + index].positionY = yOfElement - 10;
            allUi["element" + index].width = lengthOfElement + 20;
            allUi["element" + index].height = heightOfElement + 20;

            allUi["elementImg" + index].positionX = xOfElementForLoop - 10;
            allUi["elementImg" + index].positionY = yOfElement - 10;
            allUi["elementImg" + index].width = lengthOfElement + 20;
            allUi["elementImg" + index].height = heightOfElement + 20;
        }

        // When emphasied
        if (hotkey != -1) {
            xOfElementForLoop =
                xOfElement +
                lengthOfElement * hotkey +
                hotkey * widthBetweenElement;

            allUi["element" + hotkey].positionX = xOfElementForLoop - 10;
            allUi["element" + hotkey].positionY = yOfElement - 10;
            allUi["element" + hotkey].width = lengthOfElement + 20;
            allUi["element" + hotkey].height = heightOfElement + 20;

            allUi["elementImg" + hotkey].positionX = xOfElementForLoop - 10;
            allUi["elementImg" + hotkey].positionY = yOfElement - 10;
            allUi["elementImg" + hotkey].width = lengthOfElement + 20;
            allUi["elementImg" + hotkey].height = heightOfElement + 20;
        }
    }
}

function manageInfoBox() {
    let wOfBox = windowWidth / 5;
    let hOfBox = windowHeight / 1.25;
    let xOfBox = windowWidth - wOfBox;
    let yOfBox = windowHeight / 2 - hOfBox / 2;
    let xOfBoxForLoop;
    if (infoBoxOpen) {
        xOfBoxForLoop = xOfBox;
    } else {
        xOfBoxForLoop = xOfBox + wOfBox;
    }

    allUi["infoBox"].positionX = xOfBoxForLoop;
    allUi["infoBox"].positionY = yOfBox;
    allUi["infoBox"].width = wOfBox;
    allUi["infoBox"].height = hOfBox;

    let xOfIndicator = xOfBoxForLoop - wOfBox / 10;
    let yOfIndicator = windowHeight / 2 - hOfBox / 10 / 2;
    let wOfIndicator = wOfBox / 10;
    let hOfIndicator = hOfBox / 10;

    allUi["indicator"].positionX = xOfIndicator;
    allUi["indicator"].positionY = yOfIndicator;
    allUi["indicator"].width = wOfIndicator;
    allUi["indicator"].height = hOfIndicator;

    let wOfBoxElementBox = wOfBox / 1.5;
    let hOfBoxElementBox = hOfBox / 4.5;
    let xOfBoxElementBox = xOfBoxForLoop + wOfBox / 2 - wOfBoxElementBox / 2;
    let yOfBoxElementBox = yOfBox + 20;

    allUi["infoBoxElementBigImageBox"].positionX = xOfBoxElementBox;
    allUi["infoBoxElementBigImageBox"].positionY = yOfBoxElementBox;
    allUi["infoBoxElementBigImageBox"].width = wOfBoxElementBox;
    allUi["infoBoxElementBigImageBox"].height = hOfBoxElementBox;

    allUi["infoBoxElementBigImageBoxImg"].image = elementImage[5];
    allUi["infoBoxElementBigImageBoxImg"].positionX = xOfBoxElementBox;
    allUi["infoBoxElementBigImageBoxImg"].positionY = yOfBoxElementBox;
    allUi["infoBoxElementBigImageBoxImg"].width = wOfBoxElementBox;
    allUi["infoBoxElementBigImageBoxImg"].height = hOfBoxElementBox;


    



    let secondYPosition = yOfBoxElementBox + hOfBoxElementBox;
    for (let index0 = 0; index0 < 3; index0 = index0 + 1) {
        for (let index = 0; index < 3; index = index + 1) {
            let infoBoxElementLevelName = `infoBoxElementLevel${index0.toString()}-${index.toString()}`; 
            allUi[infoBoxElementLevelName].positionX = xOfBoxForLoop + (wOfBox / 6.5)
            allUi[infoBoxElementLevelName].positionY = (wOfBox / 12 * index) + 20 + (index * 10) + secondYPosition
            allUi[infoBoxElementLevelName].width = wOfBox / 12
            allUi[infoBoxElementLevelName].height = allUi[infoBoxElementLevelName].width 
        }
        secondYPosition = allUi[`infoBoxElementLevel${index0.toString()}-2`].positionY + (wOfBox / 12) + 30;
    } 
}

function manageResourceText() {
    allUi["resource"].text = `Resource: ${resource}`;
    allUi["resource"].positionX = windowWidth / 2;
    allUi["resource"].positionY = 20;
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

    if (isMouseOverUi(allUi["indicator"])) {
        if (infoBoxOpen) {
            infoBoxOpen = false;
        } else {
            infoBoxOpen = true;
        }
    }
}
