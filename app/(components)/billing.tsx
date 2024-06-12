"use client";

import { Key, useEffect, useState } from "react";
import FileHandler from "./file-handler";
import PDFtoPNG from "./PDF-to-Pages/pdf-to-png";
import PNGsToPages from "./PDF-to-Pages/png-to-pages";
import { Line } from "tesseract.js";
import ScrapeOrdersByClient from "./scrappers/billScrapper";
import Client from "./Client/client";

export default function Billing() {
	// Arquivo do faturamento em PDF;
	const [PDF, setPDF] = useState<File>();

	// Pedidos identificados;
	const [ordersByClient, setOrdersByClient] = useState<Array<Array<Line>>>();

	function onFileUpdate(PDF: File) {
		setPDF(PDF);
	}

	useEffect(() => {
		if (PDF) readPDF(PDF);
	}, [PDF]);

	async function readPDF(PDF: File) {
		console.log("PDFtoPNG...");
		const PNGs = await PDFtoPNG(PDF);
		// setPNGs(PNGs);

		console.log("PNGsToPages...");
		const pages = await PNGsToPages(PNGs);
		// setPages(pages);

		console.log("Faturamento:");
		const ordersByClient = ScrapeOrdersByClient(pages);

		setOrdersByClient(ordersByClient);
	}

	return (
		<>
			<FileHandler label="Faturamento" onFileUpdate={onFileUpdate} />

			<div id="canvas" hidden />

			{ordersByClient?.map((lines: Array<Line>, index: Key) => (
				<div key={index} className="m-1">
					<Client lines={lines} />
				</div>
			))}
		</>
	);
}
