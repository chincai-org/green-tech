function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("body");

    background(0);
}

function draw() {
    fill(255);
    let x = Math.random() * 100;
    ellipse(mouseX, mouseY, x, x);
}
