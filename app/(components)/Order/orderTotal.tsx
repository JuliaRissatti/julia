"use client";

import { useState } from "react";

import { BuyOrder } from "@/app/models/item/buy-product";
import { SellProduct } from "@/app/models/item/sell-product";

export default function OrderTotal(param: { buyProduct: BuyOrder; sellOrder: SellProduct }) {
	const [isCollapsed, setCollapsed] = useState(false);

	const buyProduct = param.buyProduct;

	const sellOrder = param.sellOrder;

	const subTotalAmarracoesCalculado = buyProduct.items.reduce(
		(amarracoes, item) => amarracoes + Number(item.amarracoes),
		0
	);

	const subTotalPecasCalculado = buyProduct.items.reduce((pecas, item) => pecas + Number(item.pecas), 0);

	const subTotalLiquidoCalculado = buyProduct.items.reduce((liquido, item) => liquido + Number(item.liquido), 0);

	const subTotalBrutoCalculado = buyProduct.items.reduce((bruto, item) => bruto + Number(item.bruto), 0);

	// if (buyProduct.productId !== sellOrder.produto) throw new Error("Deu ruim nos IDs");

	//if (subTotalAmarracoesCalculado !== buyOrder.subtotal.amarracoes) throw new Error("Deu ruim no subTotal Amarracoes calculado");
	//if (subTotalPecasCalculado !== buyOrder.subtotal.pecas) throw new Error("Deu ruim no subTotal Pecas calculado");
	//if (subTotalLiquidoCalculado !== buyOrder.subtotal.liquido) throw new Error("Deu ruim no subTotal Liquido calculado");
	//if (subTotalBrutoCalculado !== buyOrder.subtotal.bruto) throw new Error("Deu ruim no subTotal Bruto calculado");

	return (
		<>
			<div className="rounded-lg">
				<div
					className="bg-slate-500 hover:bg-[#9697a0] cursor-pointer rounded-lg m-3 p-1"
					onClick={() => setCollapsed(!isCollapsed)}
				>
					{!isCollapsed && (
						<>
							<div className="grid grid-cols-4 place-content-center text-center ">
								<div className="row-span-4 flex justify-center items-center">
									<h2 className="text-lg font-semibold">{sellOrder.produto}</h2>
								</div>
								<div className="content-center">
									<div>Total</div>
								</div>
								<div className="content-center">
									<div>Peças: {buyProduct.subtotal.pecas - sellOrder.pecas}</div>
								</div>
								<div className="content-center">
									<div>Peso: {buyProduct.subtotal.liquido - sellOrder.peso}</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}
