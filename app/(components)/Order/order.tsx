"use client";

import { useEffect, useState } from "react";

import FileHandler from "../file-handler";
import readBuyOrder from "../scrappers/buyOrderScrapper";
import readSellOrder from "../scrappers/sellOrderScrapper";
import ItemsByBuyProduct from "../TableView/itemsByBuyProduct";

import { SellItem } from "@/app/models/sell-item";
import { BuyProduct } from "@/app/models/buy-product";
import readPNG from "@/app/Services/Tesseract/read-png";
import ItemsBySellOrder from "../TableView/sellItems";
import convertToPNG from "@/app/Services/PDF-Conversion/pdf-to-png";

export default function Order({ orderNumber }: any) {
	/*
	 * Funções concernentes ao pedido de compra
	 */

	// Arquivos do pedido de compra e venda em PDF;
	const [buyOrderPDF, setBuyOrderPDF] = useState<File>();
	const [sellOrderPDF, setSellOrderPDF] = useState<File>();

	// Produtos de compra  e venda identificados;
	const [buyProducts, setBuyProducts] = useState<Array<BuyProduct>>();
	const [sellProducts, setSellProducts] = useState<Array<SellItem>>();

	useEffect(() => {
		if (buyOrderPDF) readBuyOrderPDF(buyOrderPDF);
	}, [buyOrderPDF]);

	useEffect(() => {
		if (sellOrderPDF) readSellOrderPDF(sellOrderPDF);
	}, [sellOrderPDF]);

	async function readBuyOrderPDF(buyOrderPDF: File) {
		const PNGs = await convertToPNG(buyOrderPDF, false);
		// setPNGs(PNGs);

		const pages = await readPNG(PNGs);
		// setPages(pages);

		const buyOrderProducts = readBuyOrder(orderNumber, pages);

		setBuyProducts(buyOrderProducts);
	}

	async function readSellOrderPDF(buyOrderPDF: File) {
		const PNGs = await convertToPNG(buyOrderPDF, true);
		// setPNGs(PNGs);

		const pages = await readPNG(PNGs);
		// setPages(pages);

		if (!buyProducts) return;

		const sellOrderProducts = readSellOrder(orderNumber, buyProducts, pages);

		setSellProducts(sellOrderProducts);
	}

	return (
		<>
			<div className="m-3">
				<FileHandler label={"Pedido nº " + orderNumber} onFileUpdate={(file: File) => setBuyOrderPDF(file)} />
			</div>

			{buyProducts?.map((product, index) => (
				<div key={index} className="m-3">
					<ItemsByBuyProduct id={product.id} items={product.items} subtotal={product.subtotal} />
				</div>
			))}

			<div className="m-3">
				<FileHandler label={"Pedido de Venda"} onFileUpdate={(file: File) => setSellOrderPDF(file)} />
			</div>

			{sellProducts && (
				<div className="m-3">
					<ItemsBySellOrder sellItems={sellProducts} />
				</div>
			)}
		</>
	);
}
