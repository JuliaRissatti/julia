"use client";

import { SetStateAction, useState } from "react";

import BuyOrderComponent from "../(components)/Order/BuyOrderComponent";
import SellOrderComponent from "../(components)/Order/SellOrderComponent";

import { BuyOrder } from "@/app/models/item/buy-order";
import { SellOrder } from "@/app/models/item/sell-order";
import { BuyProduct } from "@/app/models/item/buy-product";
import { SellProduct } from "@/app/models/item/sell-product";

export default function Pedido() {
	const [buyOrders, setBuyOrders] = useState<Array<BuyOrder>>();
	const [sellOrder, setSellOrder] = useState<SellOrder>();

	const handleBuyOrder = (buyOrders: SetStateAction<Array<BuyOrder> | undefined>) => {
		setBuyOrders(buyOrders);
	};

	const handleSellOrder = (sellOrder: SetStateAction<SellOrder | undefined>) => {
		setSellOrder(sellOrder);
	};

	return (
		<>
			<div id="canvas" hidden />

			<h1 className="col-span-1 text-lg text-center">Compra</h1>

			<div className="col-span-6">
				{buyOrders ? (
					<>
						{buyOrders.map((buyOrder) => (
							<div className="grid grid-cols-4 justify-evenly justify-items-center my-7 bg-azure" key={buyOrder.order}>
								<div>{buyOrder.order}</div>
								<div>
									{buyOrder.items?.map((item: BuyProduct, index: number) => (
										<div className="" key={index}>
											{item.amarracoes}
										</div>
									))}
								</div>
								<div>
									{buyOrder.items?.map((item: BuyProduct, index: number) => (
										<div className="" key={index}>
											<div>{item.pecas}</div>
										</div>
									))}
								</div>
								<div>
									{buyOrder.items?.map((item: BuyProduct, index: number) => (
										<div className="" key={index}>
											<div>{item.liquido}</div>
										</div>
									))}
								</div>

								<div>Subtotal</div>
								<div className="">{"Amarrações: " + buyOrder?.subtotal?.amarracoes}</div>
								<div className="">{"Peças:" + buyOrder?.subtotal?.pecas}</div>
								<div className="">{"Líquido:" + buyOrder?.subtotal?.liquido}</div>
							</div>
						))}
					</>
				) : (
					<BuyOrderComponent handleBuyOrder={handleBuyOrder} />
				)}
			</div>

			<h1 className="col-span-1 text-lg text-center">Venda</h1>

			<div className="col-span-6">
				{sellOrder ? (
					sellOrder?.items.map((item: SellProduct, index: number) => (
						<div className="grid grid-cols-4 justify-evenly justify-items-center my-7 bg-azure" key={item?.produto}>
							<div>{item.produto}</div>
							<div>{"Corte: " + item?.corte}</div>
							<div>{"Peças: " + item?.pecas}</div>
							<div>{"Peso: " + item?.peso}</div>
						</div>
					))
				) : (
					<SellOrderComponent sellOrder={sellOrder} handleSellOrder={handleSellOrder} />
				)}
			</div>

			<h1 className="col-span-1 text-lg text-center">Total</h1>

			<div className="col-span-6">
				{buyOrders &&
					sellOrder &&
					sellOrder.items.map((sellProduct) => {
						const buyProduct = buyOrders.find((buyOrder) => buyOrder.order === sellProduct.produto)?.subtotal;
						return (
							<>
								<div>{buyProduct?.liquido ? sellProduct.peso - buyProduct?.liquido : "Erro"}</div>
								<div>{buyProduct?.liquido ? sellProduct.pecas - buyProduct?.pecas : "Erro"}</div>
							</>
						);
					})}
			</div>
		</>
	);
}
{
	/*
	<>
	{buyOrder?.items?.map((buyProduct) => {
		const sellProduct = sellOrder?.items?.find((sellProduct) => buyProduct.produto === sellProduct.produto);
		<>
			<div>Compra: {buyProduct.liquido}</div>
			<div>Venda: {sellProduct?.peso}</div>
			<div>Total: {buyProduct.liquido - buyProduct.liquido}</div>
		</>;
	})}
</>
*/
}
