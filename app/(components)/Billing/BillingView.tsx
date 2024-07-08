"use client";

import OrdersTabPanel from "@/app/(components)/ClientOrders/ClientOrdersView";

import { Billing } from "./Billing";

export default function BillingView(parameter: { billing: Billing }) {
	const billing = parameter.billing;

	return (
		<>

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
