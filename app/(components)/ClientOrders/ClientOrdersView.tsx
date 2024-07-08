"use client";

import { useState } from "react";

import OrdersView from "./OrdersView";
import { Orders } from "../Order/Orders";
import { Billing } from "../Billing/Billing";

import { BuyOrder } from "@/app/models/item/buy-product";

export default function ClientOrdersView(parameters: { clientOrders: Billing }) {
	const clientOrders = parameters.clientOrders;

	const [activeTab, setActiveTab] = useState(0);

	const defaultStyle = "border-rich-black border border-b-0 rounded-t-md px-5";
	const unactiveStyle = "bg-slate-500 font-medium";
	const activeStyle = "bg-azure font-semibold";

	return (
		<>
			<h1 className="col-span-1 text-lg text-center">Pedidos</h1>

			<div className="col-span-6">
				{clientOrders.pedidos?.map((orders: Orders, index: number) => (
					<button
						className={defaultStyle + " " + (activeTab === index ? activeStyle : unactiveStyle)}
						key={index}
						onClick={() => setActiveTab(index)}
					>
						<h1>{orders.number}</h1>
					</button>
				))}
			</div>

			{clientOrders.pedidos?.map((pedido: Orders, index: number) => (
				<OrdersView key={index} orders={pedido} hidden={index !== activeTab} />
			))}
		</>
	);
}
