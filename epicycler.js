// Initialize the state variable and its possible states
let state = -1;
const DRAWING = 0;
const FOURIER = 1;
// Initialize an array to hold drawing data
let drawing = [];
// Initialize an array for the input signal and its fourier transform
let inputSignal = [];
let fourierSignal;
// Initialize the path array and the time variable
let path = [];
let time = 0;

function setup() {
    // Initialize the canvas and make it fill the page without scrollbars
    var canvas = createCanvas(windowWidth, windowHeight);
    document.body.style.margin = 0;
    canvas.style('display', 'block');
    // Set the background color to black
    background(0);
}

function mousePressed() {
    // Enter the drawing state
    state = DRAWING;
    // Reset program variables
    drawing = [];
    inputSignal = [];
    path = [];
    time = 0;
}

function mouseReleased() {

    // Enter the fourier state
    state = FOURIER;
    
    // Iterate through the drawing points and create an input signal
    for (let i = 0; i < drawing.length; i++) {
        const complex = new ComplexNumber(drawing[i].x, drawing[i].y);
        inputSignal.push(complex);
    }

    // Calculate the fourier transform of the signal and sort by amplitude
    fourierSignal = discreteFourierTransform(inputSignal);
    fourierSignal.sort((a, b) => b.amp - a.amp);

}

function windowResized() {
    // Resize the canvas to the new window width and height
    resizeCanvas(windowWidth, windowHeight);
}

function placeText(desiredText) {
    // Declare amount of padding for the text
    const padding = 40;
    // Construct the string and determine its width and height
    let message = desiredText.toUpperCase();
    let messageWidth = textWidth(message);
    let messageHeight = textAscent(message);
    // Add a yellow background to the text
    fill(255, 255, 0);
    strokeWeight(0);
    // Calculate rectangle parameters
    x = 3*padding/4;
    y = height-3*padding/4;
    w = padding/2+messageWidth;
    h = -messageHeight-padding/2;
    rect(x, y, w, h);
    // Add text to the canvas
    fill(0);
    textSize(16);
    textFont('Helvetica Mono');
    textStyle(BOLD);
    text(message, padding, height-padding);
}

function epicycles(x, y, rotation, fourier) {

    // Iterate through the fourier signal to draw each epicycle and radial line
    for (let i = 0; i < fourier.length; i++) {

        // Keep track of last iteration's x and y values
        let x0 = x;
        let y0 = y;
        // Obtain the frequency, radius, and amplitude
        let freq = fourier[i].freq;
        let radius = fourier[i].amp;
        let phase = fourier[i].phase;

        // Perform the relevant calculations and add to x and y
        x += radius * cos(freq * time + phase + rotation);
        y += radius * sin(freq * time + phase + rotation);

        // Draw the epicycles
        stroke(255, 255, 0, 0.25*255);
        noFill();
        ellipse(x0, y0, radius * 2);
        // Draw the radial lines
        stroke(255, 255, 0, 0.50*255);
        line(x0, y0, x, y);
    }

    // Return a vector pointing to the final coordinate
    return createVector(x, y);

}

function draw() {

    // Set the stroke weight back to its default value
    strokeWeight(2);

    // Behave differently depending on whether the user is drawing or not
    if (state == DRAWING) {

        // Set the background color to black
        background(0);

        // Create vectors based on the location of the user's mouse
        let point = createVector(mouseX - width / 2, mouseY - height / 2);
        drawing.push(point);

        // Draw the points
        stroke(255);
        noFill();
        beginShape();
        for (let pair of drawing) {
            vertex(pair.x + width / 2, pair.y + height / 2);
        }
        endShape();

        // Add text to let the user know that the drawing is being recorded
        placeText('Recording path...');
        
    } else if (state == FOURIER) {
        
        // Set the background color to black
        background(0);

        // Calculate the epicycles and add to the front of the path array
        let v = epicycles(width / 2, height / 2, 0, fourierSignal);
        path.unshift(v);

        // Begin recreating the drawing
        beginShape();
        noFill();
        for (let i =0; i < path.length; i++) {
            stroke(255);
            vertex(path[i].x, path[i].y);
        }
        endShape();

        // Add text to let the user know how many epicycles there are
        placeText(`Number of epicycles: ${fourierSignal.length}`);

        // Calculate the time step and increment the time variable
        const dt = TWO_PI / fourierSignal.length;
        time += dt;
    
        // If the drawing is finished, reset the time and path variables
        if (time > 999*TWO_PI/1000) {
            /*
                Has to be slightly less than TWO_PI to avoid the program
                drawing a connection between the first and final points
            */
            time = 0;
            path = [];
            // state = -1; // Comment out to stop animation from looping
        }
        
    }
    
}