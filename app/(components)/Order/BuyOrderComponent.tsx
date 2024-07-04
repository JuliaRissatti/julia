"use client";

import { useEffect, useState } from "react";

import FileHandler from "../file-handler";
import readBuyOrder from "../scrappers/buyOrderScrapper";

import readPNG from "@/app/Services/Tesseract/read-png";
import { BuyOrder } from "@/app/models/item/buy-product";
import convertToPNG from "@/app/Services/PDF-Conversion/pdf-to-png";

export default function BuyOrderComponent({ orderNumber }: any) {
	const [file, setFile] = useState<File>();

	const [buyOrder, setBuyOrder] = useState<Array<BuyOrder>>();

	useEffect(() => {
		if (file) readBuyOrderPDF(file);
	}, [file]);

	async function readBuyOrderPDF(buyOrderPDF: File) {
		const PNGs = await convertToPNG(buyOrderPDF, false);
		const pages = await readPNG(PNGs);
		const buyOrder = readBuyOrder(orderNumber, pages);
		setBuyOrder(buyOrder);
	}

	return (
		<>
			<div>
				<FileHandler
                    label={"Pedido de Compra"}
                    onFileUpdate={(file: File) => setFile(file)} />
			</div>
		</>
	);
}
