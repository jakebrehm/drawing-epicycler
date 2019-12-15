let x = [];
let y = [];
let fourierX;
let fourierY;
let time = 0;
let path = [];

function setup() {
    // Initialize the canvas
    var canvas = createCanvas(windowWidth, windowHeight);
    // Make it fill the page without scrollbars
    document.body.style.margin = 0;
    canvas.style('display', 'block');

    for (let i = 0; i < 100; i++) {
        angle = map(i, 0, 100, 0, TWO_PI)
        x.push(100 * cos(angle))
        y.push(100 * sin(angle))
    }

    fourierX = discreteFourierTransform(x);
    fourierX.sort((a, b) => b.amp - a.amp);

    fourierY = discreteFourierTransform(y);
    fourierY.sort((a, b) => b.amp - a.amp);

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

    let vx = epicycles(width / 2 + 100, 100, 0, fourierX);
    let vy = epicycles(100, height / 2 + 100, HALF_PI, fourierY);
    let v = createVector(vx.x, vy.y);
    path.unshift(v);
    line(vx.x, vx.y, v.x, v.y);
    line(vy.x, vy.y, v.x, v.y);

    beginShape();
    noFill();
    for (let i =0; i < path.length; i++) {
        vertex(path[i].x, path[i].y);
    }
    endShape();

    const dt = TWO_PI / fourierY.length;
    time += dt;

    if (time > TWO_PI) {
        time = 0;
        path = [];
    }
    
}