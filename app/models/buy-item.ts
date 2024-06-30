export interface BuyItem {
	pedido: string;
	item: string;
	emissao: string;
	entrega: string;
	cliente: string;
	eqtn: string;
	perfil: string;
	beneficiario: string;
	liga: string;
	tamanho: string;
	corte: string;
	amarracoes: string;
	pecas: string;
	liquido: string;
	bruto: string;
	solicitado: string;
	atendido: string;
	ca: string;
	observacao: string;
	etiqueta: string;
}

export interface BuyItemSubtotal {
	perfil: string;
	amarracoes: string;
	pecas: string;
	liquido: string;
	bruto: string;
}