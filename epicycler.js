const DRAWING = 0;
const FOURIER = 1;

let x = [];
let fourierX;
let time = 0;
let path = [];

let drawing = [];
let state = -1;

function setup() {
    // Initialize the canvas
    var canvas = createCanvas(windowWidth, windowHeight);
    // Make it fill the page without scrollbars
    document.body.style.margin = 0;
    canvas.style('display', 'block');
}

function mousePressed() {
    state = DRAWING;
    drawing = [];
    x = [];
    time = 0;
    path = [];
}

function mouseReleased() {
    state = FOURIER;
    
    for (let i = 0; i < drawing.length; i++) {

        const complex = new ComplexNumber(drawing[i].x, drawing[i].y);
        // TODO: Rename x to signal
        x.push(complex);
    }

    fourierX = discreteFourierTransform(x);
    fourierX.sort((a, b) => b.amp - a.amp);

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function epicycles(x, y, rotation, fourier) {
    for (let i = 0; i < fourier.length; i++) {
        let prevx = x;
        let prevy = y;
        let freq = fourier[i].freq;
        let radius = fourier[i].amp;
        let phase = fourier[i].phase;
        x += radius * cos(freq * time + phase + rotation);
        y += radius * sin(freq * time + phase + rotation);

        stroke(255, 100);
        noFill();
        ellipse(prevx, prevy, radius * 2);
        stroke(255);
        line(prevx, prevy, x, y);
    }

    return createVector(x, y);

}

function draw() {
    background(0);

    if (state == DRAWING) {
        let point = createVector(mouseX - width / 2, mouseY - height / 2);
        drawing.push(point);
        stroke(255);
        noFill();
        beginShape();
        for (let v of drawing) {
            vertex(v.x + width / 2, v.y + height / 2);
        }
        endShape();
    } else if (state == FOURIER) {
        let v = epicycles(width / 2, height / 2, 0, fourierX);
        path.unshift(v);
    
        beginShape();
        noFill();
        for (let i =0; i < path.length; i++) {
            vertex(path[i].x, path[i].y);
        }
        endShape();
    
        const dt = TWO_PI / fourierX.length;
        time += dt;
    
        if (time > TWO_PI) {
            time = 0;
            path = [];
        }
    }
}