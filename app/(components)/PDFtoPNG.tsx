// https://github.com/mozilla/pdf.js/discussions/17622
// https://stackoverflow.com/questions/62744470/turn-pdf-into-array-of-pngs-using-javascript-with-pdf-js
// https://stackoverflow.com/questions/53715465/can-i-set-state-insetStateide-a-useeffect-hook

"use client";

import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";

import Image from "next/image";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function DisplayTheGold({ pdf }: any) {
	const [PNGs, setPNGs] = useState<Array<string>>(new Array<string>());

	useEffect(() => {
		setPNGs(() => new Array<string>());

		const PDFasFile = pdf as File;

		PDFasFile.arrayBuffer()
			.then((arrayBuffer: ArrayBuffer) => {
				const pdfDocumentLoadingTask = pdfjs.getDocument(arrayBuffer).promise;

				pdfDocumentLoadingTask
					.then((pdf) => {
						const canvasesParentDiv = document.getElementById("canvas");
						if (!canvasesParentDiv) {
							throw Error('document.getElementById("canvas") could not find any element!');
						}

						for (let numPage = 1; numPage <= pdf.numPages; numPage++) {
							pdf
								.getPage(numPage)
								.then((page) => {
									const viewport = page.getViewport({ scale: 1 });

									const canvas = document.createElement("canvas");
									canvasesParentDiv.appendChild(canvas);

									// Prepare canvas using PDF page dimensions
									const context = canvas.getContext("2d");
									canvas.height = viewport.height;
									canvas.width = viewport.width;

									if (!context) {
										throw Error('canvas.getContext("2d") is empty');
									}

									// Render PDF page into canvas context
									const renderContext = { canvasContext: context, viewport: viewport };

									const renderTask = page.render(renderContext);
									renderTask.promise
										.then(() => {
											setPNGs((a) => [...a, canvas.toDataURL("image/png")]);
										})
										.catch((error) => {
											console.error(error);
										});
								})
								.catch((error) => {
									console.error(error);
								});
						}
					})
					.catch((error) => {
						console.error(error);
					});
			})
			.catch((error) => {
				console.error(error);
			});
	}, [pdf]);

	return (
		<>
			<div id="canvas" hidden></div>
			{PNGs.map((png, index) => (
				<Image key={index} unoptimized src={png} width={500} height={500} alt="Picture of the author" />
			))}
		</>
	);
}
