// https://github.com/mozilla/pdf.js/discussions/17622
// https://stackoverflow.com/questions/62744470/turn-pdf-into-array-of-pngs-using-javascript-with-pdf-js
// https://stackoverflow.com/questions/53715465/can-i-set-state-insetStateide-a-useeffect-hook
// https://stackoverflow.com/questions/35400722/pdf-image-quality-is-bad-using-pdf-js

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

async function PDFtoPNG(PDF: File) {

	let PNGs = new Array<string>();

	const arrayBuffer = await PDF.arrayBuffer();

	const documentProxy = await pdfjs.getDocument(arrayBuffer).promise;

	for (let numPage = 1; numPage <= documentProxy.numPages; numPage++) {
		const page = await documentProxy.getPage(numPage);

		const canvasesParentDiv = document.getElementById("canvas");

		if (!canvasesParentDiv) throw Error('document.getElementById("canvas") could not find any element!');

		const viewport = page.getViewport({ scale: 5 });

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

		PNGs.push(canvas.toDataURL("image/png"));
		
		canvas.remove();
	}

	return PNGs;
}

export default PDFtoPNG;
