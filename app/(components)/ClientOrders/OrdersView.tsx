"use client";

import { SetStateAction, useState } from "react";

import { Orders } from "../Order/Orders";
import BuyOrderComponent from "../Order/BuyOrderComponent";
import SellOrderComponent from "../Order/SellOrderComponent";

import { BuyOrder } from "@/app/models/item/buy-product";
import { SellOrder } from "@/app/models/item/sell-order";
import { BuyProduct } from "@/app/models/item/buy-product";
import { SellProduct } from "@/app/models/item/sell-product";

export default function OrdersView(parameters: { orders: Orders; hidden: boolean }) {
	const [buyOrders, setBuyOrders] = useState<Array<BuyOrder>>();
	const [sellOrder, setSellOrder] = useState<SellOrder>();

	const handleBuyOrder = (buyOrders: SetStateAction<Array<BuyOrder> | undefined>) => {
		setBuyOrders(buyOrders);
	};

	const handleSellOrder = (sellOrder: SetStateAction<SellOrder | undefined>) => {
		setSellOrder(sellOrder);
	};

	/*
	useEffect(() => {
		//	if (buyOrder && sellOrder)
	}, [buyOrder, sellOrder]);
	*/

	const orders = parameters.orders;

	return (
		<>
			<h1 className="col-span-1 text-lg text-center" hidden={parameters.hidden}>
				Compra
			</h1>

			<div className="col-span-6" hidden={parameters.hidden}>
				{buyOrders ? (
					<>
						{buyOrders.map((buyOrder) => (
							<div
								className="grid grid-cols-4 justify-evenly justify-items-center my-7 bg-azure"
								key={buyOrder.productId}
							>
								<div>{buyOrder.productId}</div>
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
					<BuyOrderComponent order={orders.buyOrder} handleBuyOrder={handleBuyOrder} />
				)}
			</div>

			<h1 className="col-span-1 text-lg text-center" hidden={parameters.hidden}>
				Venda
			</h1>

			<div className="col-span-6" hidden={parameters.hidden}>
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
					<SellOrderComponent order={orders.sellOrder} handleSellOrder={handleSellOrder} />
				)}
			</div>

			<h1 className="col-span-1 text-lg text-center" hidden={parameters.hidden}>
				Total
			</h1>

			<div className="col-span-6" hidden={parameters.hidden}>
				{buyOrders &&
					sellOrder &&
					sellOrder.items.map((sellProduct) => {
						const buyProduct = buyOrders.find((buyOrder) => buyOrder.productId === sellProduct.produto)?.subtotal;
						return (
							<>
								<div>{sellProduct.peso - buyProduct?.liquido}</div>
								<div>{sellProduct.pecas - buyProduct?.pecas}</div>
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
