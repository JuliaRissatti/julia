"use client";

import { useEffect, useState } from "react";

import FileHandler from "../file-handler";
import readSellOrder from "../scrappers/sellOrderScrapper";

import readPNG from "@/app/Services/Tesseract/read-png";
import { SellOrder } from "@/app/models/item/sell-order";
import convertToPNG from "@/app/Services/PDF-Conversion/pdf-to-png";

export default function SellOrderComponent({ orderNumber }: any) {
	const [file, setFile] = useState<File>();

	const [sellOrder, setSellOrder] = useState<SellOrder>();

	useEffect(() => {
		if (file) readSellOrderPDF(file);
	}, [file]);

	async function readSellOrderPDF(buyOrderPDF: File) {
		const PNGs = await convertToPNG(buyOrderPDF, true);
		const pages = await readPNG(PNGs);
		const sellOrder = readSellOrder(orderNumber, pages);
		setSellOrder(sellOrder);
	}

	return (
		<>
			<div>
				<FileHandler label={"Pedido de Venda"} onFileUpdate={(file: File) => setFile(file)} />
			</div>
		</>
	);
}
