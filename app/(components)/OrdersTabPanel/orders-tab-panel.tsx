"use client";

import { useState } from "react";

import { Billing } from "../Billing/Model/Billing";

import BuyOrderComponent from "../Order/BuyOrderComponent";
import SellOrderComponent from "../Order/SellOrderComponent";

export default function OrdersTabPanel(parameter: { billing: Billing }) {
	const billing = parameter.billing;

	const [activeTab, setActiveTab] = useState(0);

	const defaultStyle = "border-rich-black border border-b-0 rounded-t-md px-5";
	const unactiveStyle = "bg-slate-500 font-medium";
	const activeStyle = "bg-azure font-semibold";

	return (
		<>
			<h1 className="col-span-1 text-lg text-center">Pedidos</h1>

			<div className="col-span-6">
				{billing.pedidos?.map((numero: number, index: number) => (
					<button
						key={index}
						className={defaultStyle + " " + (activeTab === index ? activeStyle : unactiveStyle)}
						onClick={() => setActiveTab(index)}
					>
						<h1>{numero}</h1>
					</button>
				))}
			</div>

			<div className="grid grid-cols-subgrid col-span-full grid-rows-subgrid"></div>

			{billing.pedidos?.map((numero: number, index: number) => (
				<div key={index} hidden={index !== activeTab}>
					<h1 className="col-span-1 text-lg text-center">Compra</h1>

					<div className="col-span-6">
						<BuyOrderComponent numero />
					</div>

					<h1 className="col-span-1 text-lg text-center">Venda</h1>

					<div className="col-span-6">
						<SellOrderComponent numero />
					</div>

					<h1 className="col-span-1 text-lg text-center">Total</h1>

					<div className="col-span-6"></div>
				</div>
			))}

			{/* Client's orders 
				{contents?.map((content: string, index: number) => (
					<div key={index} hidden={index !== activeTab}>
						{content}
					</div>
				))}
			*/}
		</>
	);
}
