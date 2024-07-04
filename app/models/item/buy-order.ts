import { Order } from "../order/order";

export interface BuyProduct extends Order {
	emissao: Date;
	entrega: Date;
	eqtn: string;
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

export interface BuyProductSubtotal {
	produto: string;
	amarracoes: number;
	pecas: number;
	liquido: number;
	bruto: number;
}

export interface RawBuyProduct {
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

export interface RawBuyProductSubtotal {
	produto: string;
	amarracoes: string;
	pecas: string;
	liquido: string;
	bruto: string;
}
