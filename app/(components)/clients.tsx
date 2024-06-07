"use client";

// https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html

import { useEffect, useState } from "react";
import { ImageLike, Line, Page, createWorker } from "tesseract.js";
import Client from "./client";

export default function Clients({ PNGs }: any) {
	const [pages, setPages] = useState<Array<Page>>(new Array<Page>());
	const [clients, setClients] = useState<Array<Array<Line>>>(new Array<Array<Line>>());

	useEffect(() => {
		if (PNGs) PNGtoPages(PNGs);
	}, [PNGs]);

	useEffect(() => {
		if (pages) extractClientsOrders(pages);
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

	function extractClientsOrders(pages: any[]) {
		const lines = pages.reduce((lines: Array<string>, page) => lines.concat(page.lines), new Array<Line>());

		const clientsHeader = lines.findIndex((line: Line) => line.text.includes("Filial Série Nota Data"));
		if (!clientsHeader) throw Error("Não encontramos por onde começar...");

		const clientsFooter = lines.findIndex((line: Line) => line.text.includes("Total Geral"));
		if (!clientsFooter) throw Error("Não encontramos por onde começar...");

		const clientsLines = lines.slice(clientsHeader + 1, clientsFooter);

		const clients = new Array<any>();

		let lastIndex = 0;
		clientsLines.forEach((line: Line, index: number) => {
			if (line.text.includes("Sub-Total")) {
				clients.push(clientsLines.slice(lastIndex, index + 1));
				lastIndex = index + 1;
			}
		});

		setClients(clients);
	}

	return (
		<>
			{clients.map((lines, index) => (
				<div key={index} className="bg-blue-400	rounded-lg m-3">
					<Client data={lines} />
				</div>
			))}
		</>
	);
}
