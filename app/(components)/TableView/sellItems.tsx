import { BuyItem } from "@/app/models/buy-item";
import { BuyProduct } from "@/app/models/buy-product";
import { SellItem } from "@/app/models/sell-item";

export default function SellItems(param: { sellItems: Array<SellItem> }) {
	const sellItems: Array<SellItem> = param.sellItems;

	return (
		<>
			<table className="border-collapse border border-slate-500 table-auto">
				<thead>
					<tr>
						<th hidden className="border border-slate-600">Item</th>
						<th className="border border-slate-600">Produto</th>
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
						<th className="border border-slate-600">Sm n. Entrega</th>
					</tr>
				</thead>
				<tbody className="text-center">
					{sellItems?.map((item: SellItem, index: number) => (
						<tr key={index}>
							<td hidden className="border border-slate-600 p-3">{item.item}</td>
							<td className="border border-slate-600 p-3">{item.produto}</td>
							<td className="border border-slate-600 p-3">{item.beneficiario}</td>
							<td className="border border-slate-600 p-3">
								{item.seuCodigo}
							</td>
							<td className="border border-slate-600 p-3">
								{item.liga}
							</td>
							<td className="border border-slate-600 p-3">
								{item.tamanho}
							</td>
							<td className="border border-slate-600 p-3">
								{item.corte}
							</td>
							<td className="border border-slate-600 p-3">{item.pecas}</td>
							<td className="border border-slate-600 p-3">{item.preco}</td>
							<td className="border border-slate-600 p-3">{item.porcentagemIpi}</td>
							<td className="border border-slate-600 p-3">{item.valorIpi}</td>
							<td className="border border-slate-600 p-3">{item.valorDoItem}</td>
							<td className="border border-slate-600 p-3">{item.smNEntrega}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
