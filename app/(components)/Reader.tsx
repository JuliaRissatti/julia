import { createWorker, createScheduler } from "tesseract.js";

export default async function Reader(props: any) {
	const scheduler = createScheduler();
	const worker1 = await createWorker("eng");
	const worker2 = await createWorker("eng");

	(async () => {
		scheduler.addWorker(worker1);
		scheduler.addWorker(worker2);
		/** Add 10 recognition jobs */
		const results = await Promise.all(
			Array(10)
				.fill(0)
				.map(() => scheduler.addJob("recognize", props.toRead))
		);
		console.log(results);
		
		await scheduler.terminate();
	})();

	return <div>reader</div>;
}
