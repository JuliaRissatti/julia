"use client";

import { useEffect, useState } from "react";

import FileHandler from "../file-handler";
import readBuyOrder from "../scrappers/buyOrderScrapper";

import readPNG from "@/app/Services/Tesseract/read-png";
import convertToPNG from "@/app/Services/PDF-Conversion/pdf-to-png";

export default function BuyOrderComponent(parameters: { handleBuyOrder: any }) {
	const [file, setFile] = useState<File>();
	const [fileStatus, setFileStatus] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (file) readBuyOrderPDF(file);
	}, [file]);

	async function readBuyOrderPDF(buyOrderPDF: File) {
		setFileStatus("Convertendo para PNG...");
		const PNGs = await convertToPNG(buyOrderPDF, false);

		setFileStatus("Extraindo dados...");
		const pages = await readPNG(PNGs);

		setFileStatus("Interpretando");
		const buyOrder = readBuyOrder(pages);

		setFileStatus(undefined);
		parameters.handleBuyOrder(buyOrder);
	}

	return (
		<>
			<div>
				<FileHandler label={"Pedido de Compra"} status={fileStatus} onFileUpdate={(file: File) => setFile(file)} />
			</div>
		</>
	);
}
