"use client";

import { useEffect, useState } from "react";

import PDFtoPNG from "../PDF-to-Pages/pdf-to-png";
import PNGsToPages from "../PDF-to-Pages/png-to-pages";
import FileHandler from "../file-handler";
import { Line } from "tesseract.js";
import readOrder from "../scrappers/orderScrapper";
import OrderItem from "../Order-Item /order-item";

export default function Order({ orderNumber }: any) {
	// Arquivo do Pedido em PDF;
	const [PDF, setPDF] = useState<File>();

	// Items identificados;
	const [orderItems, setOrderItems] = useState<Array<Array<Line>>>();

	function onFileUpdate(PDF: File) {
		setPDF(PDF);
	}

	useEffect(() => {
		if (PDF) readPDF(PDF);
	}, [PDF]);

	async function readPDF(PDF: File) {
		const PNGs = await PDFtoPNG(PDF);
		// setPNGs(PNGs);

		console.log("PNGsToPages...");
		const pages = await PNGsToPages(PNGs);
		// setPages(pages);

		const orderItems = readOrder(pages);

		setOrderItems(orderItems);
	}

	const label = "Pedido nº " + orderNumber;

	return (
		<>
			<div className="p-3">
				<FileHandler label={label} onFileUpdate={onFileUpdate} />
			</div>

			{orderItems?.map((lines, index) => (
				<div key={index} className="m-1">
					<OrderItem orderNumber={orderNumber} lines={lines} />
				</div>
			))}
		</>
	);
}
