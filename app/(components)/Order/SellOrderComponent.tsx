"use client";

import { useEffect, useState } from "react";

import FileHandler from "../file-handler";
import readSellOrder from "../scrappers/sellOrderScrapper";

import readPNG from "@/app/Services/Tesseract/read-png";
import { SellOrder } from "@/app/models/item/sell-order";
import convertToPNG from "@/app/Services/PDF-Conversion/pdf-to-png";

export default function SellOrderComponent(parameters: { order: SellOrder | undefined; handleSellOrder: any }) {
	const [file, setFile] = useState<File>();
	const [fileStatus, setFileStatus] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (file) readSellOrderPDF(file);
	}, [file]);

	async function readSellOrderPDF(buyOrderPDF: File) {
		setFileStatus("Convertendo para PNG...");
		const PNGs = await convertToPNG(buyOrderPDF, true);

		setFileStatus("Extraindo dados...");
		const pages = await readPNG(PNGs);

		setFileStatus("Interpretando");
		const sellOrder = readSellOrder(parameters?.order?.orderNumber, pages);

		setFileStatus(undefined);
		parameters.handleSellOrder(sellOrder);
	}

	return (
		<>
			<div>
				<FileHandler label={"Pedido de Venda"} status={fileStatus} onFileUpdate={(file: File) => setFile(file)} />
			</div>
		</>
	);
}
