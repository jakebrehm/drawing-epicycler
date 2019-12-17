class ComplexNumber {
    constructor(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }

    add(addend) {
        let real = this.real + addend.real;
        let imaginary = this.imaginary + addend.imaginary;
        return new ComplexNumber(real, imaginary)
    }

    mult(multiplier) {
        let a = this.real;
        let b = this.imaginary;
        let c = multiplier.real;
        let d = multiplier.imaginary;
        const real = a * c - b * d;
        const imaginary = a * d + b * c;
        return new ComplexNumber(real, imaginary);
    }
}

/**
 * Applies a discrete fourier transform to the input signal.
 * @param {Array} x Signal on which to apply transformation.
 * @return {Array}  The resulting transformation.
 */
function discreteFourierTransform(x) {

    // Initialize the array of discrete fourier transform results
    let X = [];

    // Determine the value of N
    const N = x.length;

    // Iterate through all possible discrete frequencies
    for (let k = 0; k <= N-1; k++) {

        // Initialize the real and imaginary variables
        let sum = new ComplexNumber(0, 0);

        // Calculate the real and imaginary parts of the complex number
        for (let n = 0; n <= N-1; n++) {
            const phi = ( TWO_PI / N ) * k * n;
            const complex = new ComplexNumber(cos(phi), -sin(phi));
            sum = sum.add(x[n].mult(complex));
        }

        // Divide each part by N
        sum.real /= N;
        sum.imaginary /= N;
        
        // Calculate frequency, amplitude, and phase components
        let freq = k;
        let amp = sqrt(sum.real*sum.real + sum.imaginary*sum.imaginary);
        let phase = atan2(sum.imaginary, sum.real);

        // Create an object containing information about the transform
        X[k] = { real: sum.real, imaginary: sum.imaginary, freq, amp, phase };

    }
    // Finally, return the results of the discrete fourier transform
    return X;
}