export interface BuyItem {
	pedido: number;
	item: number;
	emissao: Date;
	entrega: Date;
	cliente: string;
	eqtn: string;
	produto: string;
	beneficiario: string;
	liga: number;
	tamanho: string;
	corte: number;
	amarracoes: number;
	pecas: number;
	liquido: number;
	bruto: number;
	solicitado: number;
	atendido: number;
	ca: string;
	observacao: string;
	etiqueta: string;
}

export interface BuyItemSubtotal {
	produto: string;
	amarracoes: number;
	pecas: number;
	liquido: number;
	bruto: number;
}

export interface RawBuyItem {
	pedido: string;
	item: string;
	emissao: string;
	entrega: string;
	cliente: string;
	eqtn: string;
	produto: string;
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

export interface RawBuyItemSubtotal {
	produto: string;
	amarracoes: string;
	pecas: string;
	liquido: string;
	bruto: string;
}
