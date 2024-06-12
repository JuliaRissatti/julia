import { MalformedClient } from "./errors";
import { Line } from "tesseract.js";
import Order from "../Order/order";
import { MalformedOrder } from "../Order/errors";

function Client({ lines }: any) {
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

	return (
		<>
			<div className="bg-[#2c369a] rounded-t-lg h-7">
				<h1 className="text-lg font-semibold align-middle text-center">{name}</h1>
			</div>

			<div className="bg-[#060c4a] rounded-b-lg">
				{verifiedOrdersNumbers?.map((lines, index) => (
					<Order orderNumber={lines} key={index} />
				))}
			</div>
		</>
	);
}

export default Client;
