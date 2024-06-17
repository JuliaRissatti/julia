import { useState } from "react";
import Item from "../Item/Item";
import { MalformedItem } from "../Item/errors";

function OrderItem({ orderNumber, lines }: any) {
	const [isCollapsed, setCollapsed] = useState(true);

	const data: Array<any> = lines;

	if (data.length < 3)
		throw new MalformedItem("O conteúdo para formar o cliente e seus pedidos está defeituoso: " + data);

	const orderItem = data.at(0)?.text.split(" ").at(0);

	const items = data.slice(1, -1);

	return (
		<>
			<div
				className="bg-[#2c369a] hover:bg-[#9697a0] cursor-pointer rounded-t-lg"
				onClick={() => setCollapsed(!isCollapsed)}
			>
				<h1 className="text-lg font-semibold align-middle text-center">{orderItem}</h1>
			</div>

			<div hidden={isCollapsed}>
				<table className="border-collapse border border-slate-500">
					<thead>
						<tr>
							<th hidden className="border border-slate-600 p-2 w-1/2">
								Pedido
							</th>
							<th hidden className="border border-slate-600 p-2 w-1/2">
								Item
							</th>
							<th className="border border-slate-600 p-2 w-1/2">Emissão</th>
							<th className="border border-slate-600 p-2 w-1/2">Entrega</th>
							<th hidden className="border border-slate-600 p-2 w-1/2">
								Cliente
							</th>
							<th hidden className="border border-slate-600 p-2 w-1/2">
								Eq Tn
							</th>
							<th hidden className="border border-slate-600 p-2 w-1/2">
								Perfil
							</th>
							<th hidden className="border border-slate-600 p-2 w-1/2">
								Beneficiário
							</th>
							<th className="border border-slate-600 p-2 w-1/2">Liga</th>
							<th className="border border-slate-600 p-2 w-1/2">Tamanho</th>
							<th className="border border-slate-600 p-2 w-1/2">Corte</th>
							<th className="border border-slate-600 p-2 w-1/2">Amr.</th>
							<th className="border border-slate-600 p-2 w-1/2">Peças</th>
							<th className="border border-slate-600 p-2 w-1/2">Líquido</th>
							<th className="border border-slate-600 p-2 w-1/2">Bruto</th>
							<th className="border border-slate-600 p-2 w-1/2">Solicitado</th>
							<th hidden className="border border-slate-600 p-2 w-1/2">
								Atendido
							</th>
							<th hidden className="border border-slate-600 p-2 w-1/2">
								C.A.
							</th>
							<th className="border border-slate-600 p-2 w-1/2">Observação</th>
							<th className="border border-slate-600 p-2 w-1/2">Etiqueta</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{items?.map((line, index) => (
							<Item key={index} orderNumber={orderNumber} orderItem={orderItem} line={line} />
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}

export default OrderItem;
