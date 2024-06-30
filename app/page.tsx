"use client";

import ScrapeOrdersByClient from "./(components)/scrappers/billScrapper";
import FileHandler from "./(components)/file-handler";
import Client from "./(components)/Client/client";

import { Key, useEffect, useState } from "react";
import { Line } from "tesseract.js";
import convertToPNG from "./Services/PDF-Conversion/pdf-to-png";
import readPNG from "./Services/Tesseract/read-png";

function Home() {
	// Arquivo do faturamento em PDF;
	const [PDF, setPDF] = useState<File>();

	const fileName = PDF?.name;

	// Pedidos identificados;
	const [ordersByClient, setOrdersByClient] = useState<Array<Array<Line>>>();

	function onFileUpdate(PDF: File) {
		setPDF(PDF);
	}

	useEffect(() => {
		if (PDF) readPDF(PDF);
	}, [PDF]);

	async function readPDF(PDF: File) {
		const PNGs = await convertToPNG(PDF, false);
		// setPNGs(PNGs);

		const pages = await readPNG(PNGs);
		// setPages(pages);

		const ordersByClient = ScrapeOrdersByClient(pages);

		setOrdersByClient(ordersByClient);
	}

	// transition duration-150 ease-out hover:ease-in

	return (
		<>
			<div className="flex flex-col items-center justify-center absolute bg-rich-black h-full w-full">
				<div id="canvas" hidden />

				<div className={`transition-all	${PDF ? "shrink" : "grow"} duration-300 flex flex-col justify-center`}>
					<p className="font-semibold">Conferência de faturamento</p>
					<FileHandler label="Faturamento" onFileUpdate={onFileUpdate} />
				</div>

				<div className={`transition-all	${PDF ? "grow" : "shrink"} duration-300  w-full`}>
					{ordersByClient?.map((lines: Array<Line>, index: Key) => (
						<div key={index} className="m-1">
							<Client lines={lines} />
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default Home;
