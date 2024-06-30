import { BuyItem } from "@/app/models/buy-item";
import { BuyProduct } from "@/app/models/buy-product";

export default function ItemsByBuyProduct(product: BuyProduct) {

	console.log(product)

	return (
		<>
			<table className="table-auto border-collapse">
				<thead>
					<tr>
						<th hidden className="border border-slate-600">
							Pedido
						</th>
						<th hidden className="border border-slate-600">
							Item
						</th>
						<th className="border border-slate-600">Emissão</th>
						<th className="border border-slate-600">Entrega</th>
						<th hidden className="border border-slate-600">
							Cliente
						</th>
						<th hidden className="border border-slate-600">
							Eq Tn
						</th>
						<th hidden className="border border-slate-600">
							Perfil
						</th>
						<th hidden className="border border-slate-600">
							Beneficiário
						</th>
						<th className="border border-slate-600">Liga</th>
						<th className="border border-slate-600">Tamanho</th>
						<th className="border border-slate-600">Corte</th>
						<th className="border border-slate-600">Amr.</th>
						<th className="border border-slate-600">Peças</th>
						<th className="border border-slate-600">Líquido</th>
						<th className="border border-slate-600">Bruto</th>
						<th className="border border-slate-600">Solicitado</th>
						<th hidden className="border border-slate-600">
							Atendido
						</th>
						<th hidden className="border border-slate-600">
							CA
						</th>
						<th className="border border-slate-600">Observação</th>
						<th className="border border-slate-600">Etiqueta</th>
					</tr>
				</thead>
				<tbody className="text-center">
					{product?.items?.map((item: BuyItem, index: number) => (
						<tr key={index}>
							<td hidden className="border border-slate-600 p-3">{item.pedido}</td>
							<td hidden className="border border-slate-600 p-3">{item.item}</td>
							<td className="border border-slate-600 p-3">{item.emissao}</td>
							<td className="border border-slate-600 p-3">{item.entrega}</td>
							<td hidden className="border border-slate-600 p-3">{item.cliente}</td>
							<td hidden className="border border-slate-600 p-3">{item.eqtn}</td>
							<td hidden className="border border-slate-600 p-3">{item.perfil}</td>
							<td hidden className="border border-slate-600 p-3">{item.beneficiario}</td>
							<td className="border border-slate-600 p-3">{item.liga}</td>
							<td className="border border-slate-600 p-3">{item.tamanho}</td>
							<td className="border border-slate-600 p-3">{item.corte}</td>
							<td className="border border-slate-600 p-3">{item.amarracoes}</td>
							<td className="border border-slate-600 p-3">{item.pecas}</td>
							<td className="border border-slate-600 p-3">{item.liquido}</td>
							<td className="border border-slate-600 p-3">{item.bruto}</td>
							<td className="border border-slate-600 p-3">{item.solicitado}</td>
							<td hidden className="border border-slate-600 p-3">{item.atendido}</td>
							<td hidden className="border border-slate-600 p-3">{item.ca}</td>
							<td className="border border-slate-600 p-3">{item.observacao}</td>
							<td className="border border-slate-600 p-3">{item.etiqueta}</td>
						</tr>
					))}
					<tr>
						<td hidden className="border border-slate-600 p-3" />
						<td hidden className="border border-slate-600 p-3" />
						<td />
						<td />
						<td hidden className="border border-slate-600 p-3" />
						<td hidden className="border border-slate-600 p-3" />
						<td hidden className="border border-slate-600 p-3" />
						<td hidden className="border border-slate-600 p-3" />
						<td />
						<td />
						<td />
						<td className="border border-slate-600 p-3">{product.subtotal.amarracoes}</td>
						<td className="border border-slate-600 p-3">{product.subtotal.pecas}</td>
						<td className="border border-slate-600 p-3">{product.subtotal.liquido}</td>
						<td className="border border-slate-600 p-3">{product.subtotal.bruto}</td>
						<td />
						<td hidden className="border border-slate-600 p-3" />
						<td hidden className="border border-slate-600 p-3" />
						<td />
						<td />
					</tr>
				</tbody>
			</table>
		</>
	);
}
