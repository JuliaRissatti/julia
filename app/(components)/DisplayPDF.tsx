// https://stackoverflow.com/questions/41503320/how-am-i-supposed-to-use-the-pdf-package-from-typescript
// https://github.com/mozilla/pdf.js/discussions/17622

import { pdfjs } from "react-pdf";
import Image from "next/image";

export default async function DisplayPDF({ properties }: any) {
	pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

	console.log(properties);

	const file: File = properties.file;

	const arrayBuffer = await file.arrayBuffer();

	// const buffer = Buffer.from(arrayBuffer);

	var pages: string[] = [];

	//var loadingTask = pdfjs.getDocument("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf");

	var loadingTask = pdfjs.getDocument(arrayBuffer);
	/*

	loadingTask.promise.then(
		function (pdf: { numPages: any; getPage: (arg0: number) => Promise<any> }) {
			var canvasdiv = document.getElementById("canvas");
			var totalPages = pdf.numPages;

			for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
				pdf
					.getPage(pageNumber)
					.then(function (page: {
						getViewport: (arg0: { scale: number }) => any;
						render: (arg0: { canvasContext: CanvasRenderingContext2D | null; viewport: any }) => any;
					}) {
						var scale = 1.5;
						var viewport = page.getViewport({ scale: scale });

						var canvas = document.createElement("canvas");
						canvasdiv?.appendChild(canvas);

						// Prepare canvas using PDF page dimensions
						var context = canvas.getContext("2d");
						canvas.height = viewport.height;
						canvas.width = viewport.width;

						// Render PDF page into canvas context
						var renderContext = { canvasContext: context, viewport: viewport };

						var renderTask = page.render(renderContext);
						renderTask.promise.then(function () {
							pages.push(canvas.toDataURL("image/png"));
							console.log(pages.length + " page(s) loaded in data");
						});
					});
			}
		},
		function (reason: any) {
			console.error(reason);
		}
	);
	*/

	return (
		<div className="h-screen w-1/2">
			<div className="h-screen w-1/2" id="canvass">
				{Array.from(pages).map((page, index) => (
					<Image key={index} src={page} alt="srcc" width={500} height={500} />
				))}
			</div>
		</div>
	);
}
