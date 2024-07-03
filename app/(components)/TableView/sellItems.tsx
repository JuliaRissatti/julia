import { SellProduct } from "@/app/models/item/sell-product";

export default function SellProducts(param: { product?: string; items: Array<SellProduct> }) {
	let items: Array<SellProduct> = new Array<SellProduct>();

	if (!param.product) {
		items.push(...param.items);
	} else {
		const item = param.items.find((item) => param.product === item.produto);
		if (!item) throw new Error("produto non encontrado");
		items.push(item);
	}

	return (
		<>
			<table className="border-collapse border border-slate-500 table-auto">
				<thead>
					<tr>
						<th hidden className="border border-slate-600">
							Item
						</th>
						<th hidden className="border border-slate-600">
							Produto
						</th>
						<th className="border border-slate-600">Beneficiário</th>
						<th className="border border-slate-600">Seu Código</th>
						<th className="border border-slate-600">Liga</th>
						<th className="border border-slate-600">Tamanho</th>
						<th className="border border-slate-600">Corte</th>
						<th className="border border-slate-600">Peças</th>
						<th className="border border-slate-600">Preço</th>
						<th className="border border-slate-600">%IPI</th>
						<th className="border border-slate-600">Valor IPI</th>
						<th className="border border-slate-600">Valor do Item</th>
						<th hidden className="border border-slate-600">
							Sm n.
						</th>
						<th className="border border-slate-600">Entrega</th>
					</tr>
				</thead>
				<tbody className="text-center">
					{items?.map((item: SellProduct, index: number) => (
						<tr key={index}>
							<td hidden className="border border-slate-600 bg-slate-200 text-black p-3">
								{item.item.toString()}
							</td>
							<td hidden className="border border-slate-600 bg-slate-200 text-black p-3">
								{item.produto}
							</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.beneficiario}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.seuCodigo}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.liga.toString()}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.tamanho}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.corte.toString()}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.pecas.toString()}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.peso.toString()}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.preco.toString()}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.porcentagemIpi.toString()}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.valorIpi.toString()}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.valorDoItem.toString()}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.smn}</td>
							<td className="border border-slate-600 bg-slate-200 text-black p-3">{item.entrega.toDateString()}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
