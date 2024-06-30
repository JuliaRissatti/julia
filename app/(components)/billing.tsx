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
		const PNGs = await PDFtoPNG(PDF);
		// setPNGs(PNGs);

		const pages = await PNGsToPages(PNGs);
		// setPages(pages);

		const ordersByClient = ScrapeOrdersByClient(pages);

		setOrdersByClient(ordersByClient);
	}

	return (
		<>
			<div className="flex items-center justify-center absolute bg-rich-black h-full w-full">
				<div className="flex flex-col gap-7">
					<div className="flex w-full justify-center font-semibold">
						<p>Conferência de faturamento</p>
					</div>
					<div className="w-full">
						<FileHandler label="Faturamento" onFileUpdate={onFileUpdate} />

						<div id="canvas" hidden />

						{ordersByClient?.map((lines: Array<Line>, index: Key) => (
							<div key={index} className="m-1">
								<Client lines={lines} />
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
