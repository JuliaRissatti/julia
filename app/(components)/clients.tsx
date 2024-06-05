"use client";

// https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html

import { useEffect, useState } from "react";
import { ImageLike, Line, Page, createWorker } from "tesseract.js";

export default function Cliente({ PNGs }: any) {
	const [pages, setPages] = useState<Array<Page>>(new Array<Page>());
	const [clients, setClients] = useState<Array<Array<Line>>>(new Array<Array<Line>>());

	useEffect(() => {
		if (PNGs) PNGtoPages(PNGs);
	}, [PNGs]);

	useEffect(() => {
		if (pages) getClientesFromPages(pages);
	}, [pages]);

	async function PNGtoPages(PNGs: ImageLike[]) {
		let pages: Array<Page> = new Array<Page>();

		console.log("aler");

		for (const PNG of PNGs) {
			await createWorker("por").then((worker) =>
				worker.recognize(PNG).then((result) => {
					const page: Page = result.data;
					pages.push(page);
				})
			);
		}

		setPages(pages);
	}

	function getClientesFromPages(pages: any[]) {
		const lines = pages.reduce((lines: Array<string>, page) => lines.concat(page.lines), new Array<Line>());

		const ordersHeader = lines.findIndex((line: Line) => line.text.includes("Filial Série Nota Data"));
		if (!ordersHeader) throw Error("Não encontramos por onde começar...");

		const ordersFooter = lines.findIndex((line: Line) => line.text.includes("Total Geral"));
		if (!ordersFooter) throw Error("Não encontramos por onde começar...");

		const ordersLines = lines.slice(ordersHeader + 1, ordersFooter);

		const clients = new Array<any>();

		let lastIndex = 0;
		ordersLines.forEach((line: Line, index: number) => {
			if (line.text.includes("Sub-Total")) {
				clients.push(ordersLines.slice(lastIndex, index + 1));
				lastIndex = index + 1;
			}
		});

		console.log("clients")
		console.log(clients)
		setClients(clients);
	}

	return (
		<div>
			Clientes: {clients.length}
			{clients.map((lines) => (
				lines.map((line, index) => (
					<p key={index}>{line.text}</p>
				))
			))}
		</div>
	);
}