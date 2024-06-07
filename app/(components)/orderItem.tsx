export default function OrderItem({ data }: any) {
	type OrderItem = {
		pedido: number;
		item: number;
		emissao: Date;
		entrega: Date;
		cliente: string;
		eqtn: number;
		perfil: number;
		beneficiario: number;
		liga: number;
		tamanho: number;
		corte: number;
		amr: number;
		pecas: number;
		liquido: number;
		bruto: number;
		solicitado: number;
		atendido: number;
		ca: number;
		observacao: number;
		etiqueta: number;
	};

	const lines: Array<any> = data;

	if (lines.length < 3) throw new Error("Tem nos items do pedido.", { cause: lines });

	const name = lines.at(0)?.text.split(" ").at(0);

	const items = lines.slice(1, -1);

	console.log(items);

	return (
		<>
			<div className="bg-blue-800	rounded-lg m-3">
				<p>{name}</p>
			</div>
			<table className="table-auto">
				<thead>
					<tr>
						
						<th> property </th>
					</tr>
				</thead>
			</table>
			{items.map((item, index) => (
				<p key={index}>{item.text}</p>
			))}
		</>
	);
}
