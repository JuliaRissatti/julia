/*
 * Binarization
 *
 * To binarize an image means to convert the pixels of an image to either black or white.
 * To determine whether the pixel is black or white, we define a threshold value. Pixels
 * that are greater than the threshold value are black, otherwise they are white. Applying
 * a threshold filter removes a lot of unwanted information from the image.
 *
 * https://dev.to/mathewthe2/using-javascript-to-preprocess-images-for-ocr-1jc
 *
 */

function thresholdFilter(pixels, level) {
	if (level === undefined) {
		level = 0.5;
	}

	const thresh = Math.floor(level * 255);

	for (let i = 0; i < pixels.length; i += 4) {
		const r = pixels[i];
		const g = pixels[i + 1];
		const b = pixels[i + 2];
		const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		let val;

		if (gray >= thresh) {
			val = 255;
		} else {
			val = 0;
		}

		pixels[i] = pixels[i + 1] = pixels[i + 2] = val;
	}

	return pixels;
}

export { thresholdFilter };
