"use client";

import OrdersTabPanel from "@/app/(components)/OrdersTabPanel/orders-tab-panel";

import { Billing } from "../../Model/Billing";

export default function BillingView(parameter: { billing: Billing }) {
	const billing = parameter.billing;

	return (
		<>
			<div className="grid grid-cols-7 grid-flow-row grid-rows-5 bg-indigo-dye m-5 p-2">
				<h1 className="col-span-full text-lg font-semibold text-center">{parameter.billing.cliente}</h1>

				<OrdersTabPanel billing={billing} />
			</div>
		</>
	);
}

/*
Mapeia os pedidos verificados a um elemento <Order>
const verifiedOrders = verifiedOrdersNumbers.map((order, index) => <ClientOrder key={index} orderNumber={order} />);

<div className="hover:bg-[#9697a0] cursor-pointer" onClick={() => setCollapsed(!isCollapsed)}> </div>

{!isCollapsed && <TabPanel tabs={verifiedOrdersNumbers} contents={verifiedOrders} />}
<div className="grid grid-cols-subgrid grid-flow-col col-span-6 row-span-4 grid-rows-subgrid bg-oxford-blue">
	<OrdersTabPanel tabs={verifiedOrdersNumbers} contents={verifiedOrders} />
</div>
*/
