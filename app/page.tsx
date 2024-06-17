"use client";

import ScrapeOrdersByClient from "./(components)/scrappers/billScrapper";
import PNGsToPages from "./(components)/PDF-to-Pages/png-to-pages";
import PDFtoPNG from "./(components)/PDF-to-Pages/pdf-to-png";
import FileHandler from "./(components)/file-handler";
import Client from "./(components)/Client/client";

import { Key, useEffect, useState } from "react";
import { Line } from "tesseract.js";

function Home() {
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

	// transition duration-150 ease-out hover:ease-in

	return (
		<>
			<div 
			className="flex flex-col transition ease-in-out hover:scale-110 hover:flex-row duration-300 gap-7 items-center justify-center absolute bg-rich-black h-full w-full">
				<div id="canvas" hidden />
				<div className="flex justify-center font-semibold">
					<p>Conferência de faturamento</p>
				</div>
				<div className="flex justify-center">
					<FileHandler label="Faturamento" onFileUpdate={onFileUpdate} />
				</div>
			</div>
			{ordersByClient?.map((lines: Array<Line>, index: Key) => (
				<div key={index} className="m-1">
					<Client lines={lines} />
				</div>
			))}
		</>
	);
}

export default Home;
