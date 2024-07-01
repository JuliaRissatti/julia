"use client";

import { useEffect, useState } from "react";

import FileHandler from "../file-handler";
import readBuyOrder from "../scrappers/buyOrderScrapper";
import readSellOrder from "../scrappers/sellOrderScrapper";

import { SellItem } from "@/app/models/item/sell-item";
import readPNG from "@/app/Services/Tesseract/read-png";
import { BuyProduct } from "@/app/models/item/buy-product";
import convertToPNG from "@/app/Services/PDF-Conversion/pdf-to-png";

export default function Order({ orderNumber }: any) {
	/*
	 * Funções concernentes ao pedido de compra
	 */

	// Arquivos do pedido de compra e venda em PDF;
	const [buyOrderPDF, setBuyOrderPDF] = useState<File>();
	const [sellOrderPDF, setSellOrderPDF] = useState<File>();

	// Produtos de compra  e venda identificados;
	const [buyOrder, setBuyOrder] = useState<Array<BuyProduct>>();
	const [sellProducts, setSellProducts] = useState<Array<SellItem>>();

	useEffect(() => {
		if (buyOrderPDF) readBuyOrderPDF(buyOrderPDF);
	}, [buyOrderPDF]);

	useEffect(() => {
		if (sellOrderPDF) readSellOrderPDF(sellOrderPDF);
	}, [sellOrderPDF]);

	async function readBuyOrderPDF(buyOrderPDF: File) {
		const PNGs = await convertToPNG(buyOrderPDF, false);
		const pages = await readPNG(PNGs);
		const buyOrder = readBuyOrder(orderNumber, pages);
		setBuyOrder(buyOrder);
	}

	async function readSellOrderPDF(buyOrderPDF: File) {
		if (!buyOrder) return;

		const PNGs = await convertToPNG(buyOrderPDF, true);
		const pages = await readPNG(PNGs);
		const sellOrderProducts = readSellOrder(orderNumber, buyOrder, pages);
		setSellProducts(sellOrderProducts);
	}

	return (
		<>
			<div className="flex justify-evenly m-3">
				<FileHandler label={"Pedido nº " + orderNumber} onFileUpdate={(file: File) => setBuyOrderPDF(file)} />
				<FileHandler label={"Pedido de Venda - " + orderNumber} onFileUpdate={(file: File) => setSellOrderPDF(file)} />
			</div>

			{/*
			{buyOrder?.map((buyProduct, index) => (
				<>
					<div key={index} className="m-3">
						<ItemsByBuyProduct id={product.id} items={product.items} subtotal={product.subtotal} />
						{sellProducts && <ItemsBySellOrder product={product.id} items={sellProducts} />}
					</div>
				</>
			))}
			*/}
		</>
	);
}
