// https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html

import { ImageLike, Line, Page, createWorker } from "tesseract.js";

async function readPNG(PNGs: ImageLike[]) {
	let pages: Array<Page> = new Array<Page>();

	for (const PNG of PNGs) {
		const worker = await createWorker("por", 1, {
			logger: (m) => console.log(m),
		});

		const recognition = await worker.recognize(PNG);

		const page: Page = recognition.data;

		await worker.terminate();

		pages.push(page);
	}

	return pages;
}

export default readPNG;
