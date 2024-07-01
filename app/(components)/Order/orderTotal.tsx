"use client";

import { useState } from "react";

import { SellOrder } from "@/app/models/item/sell-order";
import { BuyProduct } from "@/app/models/item/buy-product";

export default function orderTotal(param: { buyOrder: BuyProduct; sellOrder: SellOrder }) {
	// const [isCollapsed, setCollapsed] = useState(true);

	const buyOrder = param.buyOrder;

	const sellOrder = param.sellOrder;

	const subTotalAmarracoes = buyOrder.items.reduce((amarracoes, item) => amarracoes + Number(item.amarracoes), 0);

	const subTotalPecas = buyOrder.items.reduce((pecas, item) => pecas + Number(item.pecas), 0);

	const subTotalLiquido = buyOrder.items.reduce((liquido, item) => liquido + Number(item.liquido), 0);

	const subTotalBruto = buyOrder.items.reduce((bruto, item) => bruto + Number(item.bruto), 0);

	if (buyOrder.productId !== sellOrder.orderId) throw new Error("Deu ruim nos IDs");

	function verifyData() {
		if (subTotalAmarracoes !== buyOrder.subtotal.amarracoes) throw new Error("Deu ruim nos IDs");
	}

	return (
		<>
			<div className="rounded-lg">
				{/*
				<div className="hover:bg-[#9697a0] cursor-pointer rounded-t-lg" onClick={() => setCollapsed(!isCollapsed)}>
					<h1 className="text-lg font-semibold align-middle text-center"></h1>
				</div>

				{!isCollapsed && "not collapse"}
				{isCollapsed && "collapse"}
				*/}
			</div>
		</>
	);
}
