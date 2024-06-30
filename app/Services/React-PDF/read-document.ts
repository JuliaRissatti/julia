// https://github.com/mozilla/pdf.js/discussions/17622
// https://stackoverflow.com/questions/62744470/turn-pdf-into-array-of-pngs-using-javascript-with-pdf-js
// https://stackoverflow.com/questions/53715465/can-i-set-state-insetStateide-a-useeffect-hook
// https://stackoverflow.com/questions/35400722/pdf-image-quality-is-bad-using-pdf-js

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

async function readDocument(file: File) {
	const arrayBuffer = await file.arrayBuffer();

	const documentProxy = await pdfjs.getDocument(arrayBuffer).promise;

	return documentProxy;
}

export default readDocument;