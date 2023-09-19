const allUi = [];
<<<<<<< HEAD
const allUiKey = []
//e
=======
const allUiKey = [];
//eeeeeee
>>>>>>> 7df94a2220b39cfaa15e737a7a246da6db43e383
class Ui {
    constructor(positionX, positionY, width, height, color = "white") {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
        this.color = color;

        this.key = this.getKey();

        if (!allUiKey.includes(this.key)) {
            this.register();
        }

        this.draw();
    }

    getKey() {
        // Create a unique key based on the properties of the Ui object
        return `${this.positionX}_${this.positionY}_${this.width}_${this.height}_${this.color}`;
    }

    register() {
        allUiKey.push(this.key);
        allUi.push(this);
    }

    draw() {
        fill(this.color);
        rect(this.positionX, this.positionY, this.width, this.height);
    }

    //TODO: text
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
