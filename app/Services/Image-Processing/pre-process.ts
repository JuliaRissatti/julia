import { invertColors } from "./helper";
import { blurARGB, dilate } from "./noise-removal";
import { thresholdFilter } from "./binarization";

function processImage(canvas: HTMLCanvasElement) {
	const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

	const imageData: ImageData | undefined = context?.getImageData(0, 0, canvas.width, canvas.height);

	let pixels: Uint8ClampedArray | undefined = imageData?.data;

	// Blur
	pixels = blurARGB(pixels, canvas, 1);

	// Dilate
	pixels = dilate(pixels, canvas);

	// Invert Colors
	pixels = invertColors(pixels);

	// Binarize
	pixels = thresholdFilter(pixels, 0.5);

	if (!pixels) return

	return new ImageData(pixels, canvas.width, canvas.height)
}

export default processImage;
