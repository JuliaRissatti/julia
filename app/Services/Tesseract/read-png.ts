// https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html

import Tesseract, { ImageLike, Page, createScheduler, createWorker } from "tesseract.js";

export default async function readPNG(PNGs: ImageLike[]) {
	const scheduler = createScheduler();

	for (let workers = 0; workers < PNGs.length*2; workers++) {
		const worker = await createWorker("por", 1, {
			logger: (m) => console.log(m),
		});
		scheduler.addWorker(worker);
	}

	const pages = await Promise.all(PNGs.map((PNG) => scheduler.addJob("recognize", PNG)));

	await scheduler.terminate();

	return pages.map((recognizeResult: Tesseract.RecognizeResult) => recognizeResult.data);
}

/*
const rets 

	const recognition = await worker.recognize(PNG);

	const page: Page = recognition.data;

	await worker.terminate();

	pages.push(page);

		const recognition = await worker.recognize(PNG);
		
		// const page: Page = recognition.data;
		
		// await worker.terminate();
		
		// pages.push(page);
		*/
