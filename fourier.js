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
        let real = 0;
        let imaginary = 0;

        // Calculate the real and imaginary parts of the complex number
        for (let n = 0; n <= N-1; n++) {
            const phi = ( TWO_PI / N ) * k * n;
            real += x[n] * cos(phi);
            imaginary -= x[n] * sin(phi);
        }

        // Divide each part by N
        real /= N;
        imaginary /= N;
        
        // Calculate frequency, amplitude, and phase components
        let freq = k;
        let amp = sqrt(real*real + imaginary*imaginary);
        let phase = atan2(imaginary, real);

        // Create an object containing information about the transform
        X[k] = { real, imaginary, freq, amp, phase };

    }
    // Finally, return the results of the discrete fourier transform
    return X;
}