let allUi = [];

class Ui {
    constructor(positionX, positionY, width, height, color = "white", tag = "") {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
        this.color = color;
        this.tag = tag;

        this.key = this.getKey();

        if (!allUi.some(ui => ui.key === this.key)) {
            this.register();
        }

        this.draw();
    }

    getKey() {
        // Create a unique key based on the properties of the Ui object
        return `${this.positionX}_${this.positionY}_${this.width}_${this.height}_${this.color}`;
    }


    register() {
        allUi.push(this);
    }

    draw() {
        fill(this.color);
        rect(this.positionX, this.positionY, this.width, this.height);
    }

    //TODO: text
}

function unregisterUi(tag) {
    uiToUnregister = allUi.find(ui => ui.tag === tag);
    allUi = allUi.filter(ui => ui.tag !== tag);
}

function isMouseOnAnyUi() {
    console.log(allUi.length);
    return allUi.some(ui =>
        mouseX < ui.positionX + ui.width &&
        mouseX > ui.positionX &&
        mouseY > ui.positionY &&
        mouseY < ui.positionY + ui.height
    );
}
