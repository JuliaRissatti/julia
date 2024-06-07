// https://github.com/mozilla/pdf.js/discussions/17622
// https://stackoverflow.com/questions/62744470/turn-pdf-into-array-of-pngs-using-javascript-with-pdf-js
// https://stackoverflow.com/questions/53715465/can-i-set-state-insetStateide-a-useeffect-hook
// https://stackoverflow.com/questions/35400722/pdf-image-quality-is-bad-using-pdf-js

"use client";

import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function PdfToPng({ PDF, onChildDataUpdate }: any) {
	useEffect(() => {
		PDF?.arrayBuffer()
			.then((arrayBuffer: ArrayBuffer) => {
				const documentPages = new Array<any>();

				const getDocumentPromise = pdfjs.getDocument(arrayBuffer).promise;

				getDocumentPromise
					.then(async (pdf) => {
						let PNGs = new Array<string>();

						for (let numPage = 1; numPage <= pdf.numPages; numPage++) {
							await pdf
								.getPage(numPage)
								.then((documentPage) => {
									documentPages.push(documentPage);
								})
								.catch((error: any) => {
									throw error;
								});
						}

						const canvasesParentDiv = document.getElementById("canvas");

						if (!canvasesParentDiv) throw Error('document.getElementById("canvas") could not find any element!');

						for await (const page of documentPages) {
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

							const pageRenderPromise = page.render(renderContext).promise;

							await pageRenderPromise
								.then(() => {
									PNGs.push(canvas.toDataURL("image/png"));
								})
								.catch((error: any) => {
									throw error;
								})
								.finally(() => {
									canvas.remove();
								});
						}

						onChildDataUpdate(PNGs);
					})
					.catch((error: any) => {
						throw error;
					});
			})
			.catch((error: any) => {
				throw error;
			});
	}, [PDF]);

	return <div id="canvas" hidden />;
}

export default PdfToPng;