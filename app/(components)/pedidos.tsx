"use client";

/*
Cabeçalho de faturamento:
Filial Série Nota Data T.-Saída Peso(kg) ValordaNotalCM VICMS V.ICMS-ST ValorIPI ValorPIS V.COFINS Preço Bruto /Líquido Condição Pagamento P.Md.
*/

// https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html

import { useEffect, useState } from "react";
import { ImageLike, Line, Page, createWorker } from "tesseract.js";

export default function Pedidos({ PNGs }: any) {
	const [pages, setPages] = useState<Array<Page>>(new Array<Page>());

	useEffect(() => {
		if (PNGs) PNGtoPages(PNGs);
	}, [PNGs]);

	useEffect(() => {
		if (pages) getLinesText(pages);
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

	function getLinesText(pages: any[]) {
		const lines = pages.reduce((lines: Array<string>, page) => lines.concat(page.lines), new Array<Line>());

		const cabecalhoDosPedidos = lines.findIndex((line: Line) => line.text.includes("Filial Série Nota Data"));
		if (!cabecalhoDosPedidos) throw Error("Não encontramos por onde começar...");

		const rodapeDosPedidos = lines.findIndex((line: Line) => line.text.includes("Total Geral"));
		if (!rodapeDosPedidos) throw Error("Não encontramos por onde começar...");

		// return lines.slice(cabecalhoDosPedidos + 1, rodapeDosPedidos);

		console.log("order lines");
		const ordersLines = lines.slice(cabecalhoDosPedidos + 1, rodapeDosPedidos);
		console.log(ordersLines);

		const orders = new Array<any>();

		let lastIndex = 0;
		ordersLines.forEach((line: Line, index: number) => {
			if (line.text.includes("Sub-Total")) {
				orders.push(ordersLines.slice(lastIndex, index + 1));
				lastIndex = index + 1;
			}
		});

		console.log("orders");
		console.log(orders);
	}

	function aGetOrdersLines(pages: any[]) {
		const lines = pages.reduce((lines: Array<string>, page) => lines.concat(page.lines), new Array<string>());

		const cabecalhoDosPedidos = lines.findIndex((line) => line.includes("Filial Série Nota Data"));
		if (!cabecalhoDosPedidos) throw Error("Não encontramos por onde começar...");

		const rodapeDosPedidos = lines.findIndex((line) => line.includes("Total Geral"));
		if (!rodapeDosPedidos) throw Error("Não encontramos por onde começar...");

		const ordersLines = lines.slice(cabecalhoDosPedidos + 1, rodapeDosPedidos);

		const orders = new Array<any>();

		let lastIndex = 0;
		ordersLines.forEach((line, index) => {
			if (line.includes("Sub-Total")) {
				orders.push(ordersLines.slice(lastIndex, index + 1));
				lastIndex = index + 1;
			}
		});
	}

	return (
		<div>
			Pages:
			<p>{pages?.length}</p>
		</div>
	);
}
