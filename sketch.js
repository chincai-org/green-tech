function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.style("position", "fixed");
    canvas.style("top", "0");
    canvas.style("left", "0");
    canvas.style("z-index", "-1");
    canvas.parent("body");

    background(0);
}

function draw() {
    fill(200);
    square(10,10,10);
}
