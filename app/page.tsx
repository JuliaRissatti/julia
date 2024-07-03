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
			<div className="grid grid-cols-1 grid-rows-auto grid-flow-row bg-rich-black h-screen items-center">
				<div className={`transition-all ${PDF ? "h-min" : "h-max"} duration-300`}>
					<div className="grid grid-rows-1 grid-flow-col justify-center items-center gap-3">
						<p className="font-semibold">Conferência de faturamento</p>
						<FileHandler label="Faturamento" onFileUpdate={onFileUpdate} />
					</div>
				</div>

				<div id="canvas" hidden />

				{ordersByClient?.map((lines: Array<Line>, index: Key) => (
					<Client key={index} lines={lines} />
				))}
			</div>
		</>
	);
}

export default Home;
