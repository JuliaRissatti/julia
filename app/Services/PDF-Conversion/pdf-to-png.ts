import readDocument from "@/app/Services/React-PDF/read-document";
import processImage from "../Image-Processing/pre-process";

async function convertToPNG(PDF: File, imagePreProcessing: boolean) {
	const documentProxy = await readDocument(PDF);

	let PNGs = new Array<string>();

	for (let numPage = 1; numPage <= documentProxy.numPages; numPage++) {
		const page = await documentProxy.getPage(numPage);

		const canvasesParentDiv = document.getElementById("canvas");

		if (!canvasesParentDiv) throw Error('document.getElementById("canvas") could not find any element!');

		const viewport = page.getViewport({ scale: 7 });

		const canvas = document.createElement("canvas");
		canvasesParentDiv.appendChild(canvas);

		// Prepare canvas using PDF page dimensions
		const context = canvas.getContext("2d");
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		if (!context) throw Error('canvas.getContext("2d") is empty');

		// Render PDF page into canvas context
		const renderContext = { canvasContext: context, viewport: viewport };

		await page.render(renderContext).promise;

		const processedImageData = processImage(canvas);

		if (imagePreProcessing && processedImageData) {
			context.putImageData(processedImageData, 0, 0);
		}

		PNGs.push(canvas.toDataURL("image/png"));

		if (!imagePreProcessing) {
			canvas.remove();
		}
	}

	return PNGs;
}

export default convertToPNG;
