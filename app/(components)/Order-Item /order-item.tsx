import Item from "../Item/Item";
import { MalformedItem } from "../Item/errors";

function OrderItem({ orderNumber, lines }: any) {
	const data: Array<any> = lines;

	if (data.length < 3)
		throw new MalformedItem("O conteúdo para formar o cliente e seus pedidos está defeituoso: " + data);

	const orderItem = data.at(0)?.text.split(" ").at(0);

	const items = data.slice(1, -1);

	console.log(items)

	return (
		<>
			<div className="bg-[#2c369a] rounded-t-lg h-7">
				<h1 className="text-lg font-semibold align-middle text-center">{orderItem}</h1>
			</div>

			<div className="bg-[#060c4a] rounded-b-lg">
				{items?.map((line, index) => (
					<Item key={index} orderNumber={orderNumber} orderItem={orderItem} line={line} />
				))}
			</div>
		</>
	);
}

export default OrderItem;
