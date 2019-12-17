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

    // Set the background color to black
    background(0);

    // Behave differently depending on whether the user is drawing or not
    if (state == DRAWING) {

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

        // // Add text to let the user know that the drawing is being recorded
        // let padding = 20;
        // textSize(32);
        // fill(255, 255, 0);
        // text('Recording path...', padding, height-padding);

        // Declare amount of padding for the text
        const padding = 40;
        // Construct the string and determine its width and height
        let recordingMessage = 'Recording path...'
        recordingMessage = recordingMessage.toUpperCase();
        let recordingWidth = textWidth(recordingMessage);
        let recordingHeight = textAscent(recordingMessage);
        // Add a white background to the text
        fill(255);
        x = padding/2;
        y = height-padding/2;
        w = padding+recordingWidth;
        h = -recordingHeight-padding;
        rect(x, y, w, h);
        // Add text to let the user know that the drawing is being recorded
        fill(0);
        textSize(24);
        textFont('Helvetica');
        text(recordingMessage, padding, height-padding);
        
    } else if (state == FOURIER) {
        
        // Calculate the epicycles and add to the front of the path array
        let v = epicycles(width / 2, height / 2, 0, fourierSignal);
        path.unshift(v);
    
        // Begin drawing the shape
        beginShape();
        noFill();
        for (let i =0; i < path.length; i++) {
            stroke(255);
            vertex(path[i].x, path[i].y);
        }
        endShape();
    
        // Calculate the time step and increment the time variable
        const dt = TWO_PI / fourierSignal.length;
        time += dt;
    
        // If the drawing is finished, reset the time and path variables
        if (time > TWO_PI) {
            time = 0;
            path = [];
        }

        // Declare amount of padding for the text
        const padding = 40;
        // Construct the string and determine its width and height
        let numberEpicycles = `Number of epicycles: ${fourierSignal.length}`;
        numberEpicycles = numberEpicycles.toUpperCase();
        let messageWidth = textWidth(numberEpicycles);
        let messageHeight = textAscent(numberEpicycles);
        // Add a white background to the text
        fill(255);
        x = padding/2;
        y = height-padding/2;
        w = padding+messageWidth;
        h = -messageHeight-padding;
        rect(x, y, w, h);
        // Add text to let the user know how many epicycles there are
        fill(0);
        textSize(24);
        textFont('Helvetica');
        text(numberEpicycles, padding, height-padding);

    }
    
}