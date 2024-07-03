import { MalformedClient } from "./errors";
import { Line } from "tesseract.js";
import Order from "../Order/client-order";
import { MalformedOrder } from "../Order/errors";
import { useState } from "react";
import TabPanel from "../TabPanel/tab-panel";

export default function Client({ lines }: any) {
	const [isCollapsed, setCollapsed] = useState(true);

	const data: Array<Line> = lines;

	if (data.length < 3)
		throw new MalformedClient("O conteúdo para formar o cliente e seus pedidos está defeituoso: " + data);

	const name = data.at(0)?.text.split(" ").slice(1).join(" ");

	// Atribuição do número de pedido para todos os pedidos
	const ordersNumbers = data.slice(1, -1).map((line: Line) => {
		const orderString = line.words.at(-1)?.text;
		const orderNumber = Number(orderString);
		return orderNumber;
	});

	// Verificação se todos os pedidos receberam um número de pedido
	const verifiedOrdersNumbers = ordersNumbers.map((order: number, index: number) => {
		try {
			if (Number.isNaN(order)) {
				return ordersNumbers.at(index - 1);
			} else {
				return order;
			}
		} catch {
			throw new MalformedOrder("A identificação do número dos pedidos falhou: " + data);
		}
	});

	// Mapeia os pedidos verificados a um elemento <Order>
	const verifiedOrders = verifiedOrdersNumbers.map((order, index) => <Order key={index} orderNumber={order} />);

	return (
		<>
			<div className="bg-azure">
				<div className="hover:bg-[#9697a0] cursor-pointer" onClick={() => setCollapsed(!isCollapsed)}>
					<h1 className="text-lg font-semibold align-middle text-center">{name}</h1>
				</div>

				{!isCollapsed && <TabPanel tabs={verifiedOrdersNumbers} contents={verifiedOrders} />}
			</div>
		</>
	);
}
