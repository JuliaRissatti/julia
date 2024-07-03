"use client";

import { useEffect, useState } from "react";

import OrderTotal from "./orderTotal";
import FileHandler from "../file-handler";
import readBuyOrder from "../scrappers/buyOrderScrapper";
import readSellOrder from "../scrappers/sellOrderScrapper";

import readPNG from "@/app/Services/Tesseract/read-png";
import { SellOrder } from "@/app/models/item/sell-order";
import { BuyProduct } from "@/app/models/item/buy-product";
import convertToPNG from "@/app/Services/PDF-Conversion/pdf-to-png";

export default function ClientOrder({ orderNumber }: any) {
	/*
	 * Funções concernentes ao pedido de compra
	 */

	// Arquivos do pedido de compra e venda em PDF;
	const [buyOrderPDF, setBuyOrderPDF] = useState<File>();
	const [sellOrderPDF, setSellOrderPDF] = useState<File>();

	// Produtos de compra  e venda identificados;
	const [buyOrder, setBuyOrder] = useState<Array<BuyProduct>>();
	const [sellOrder, setSellOrder] = useState<SellOrder>();

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
		const sellOrder = readSellOrder(orderNumber, buyOrder, pages);
		setSellOrder(sellOrder);
	}

	function combinedBuyAndSellOrders() {
		return buyOrder?.map((buyProduct) => {
			const sellProduct = sellOrder?.items?.find((sellProduct) => buyProduct.productId === sellProduct.produto);
			return { buyProduct, sellProduct };
		});
	}

	return (
		<>
			<div className="flex justify-evenly m-3">
				<FileHandler label={"Pedido nº " + orderNumber} onFileUpdate={(file: File) => setBuyOrderPDF(file)} />
				<FileHandler label={"Pedido de Venda - " + orderNumber} onFileUpdate={(file: File) => setSellOrderPDF(file)} />
			</div>

			<div className="grid grid-cols-1 ">
				{combinedBuyAndSellOrders()?.map((product, index) => {
					if (product.sellProduct !== undefined)
						return <OrderTotal key={index} buyProduct={product.buyProduct} sellOrder={product.sellProduct} />;
				})}
			</div>
		</>
	);
}
