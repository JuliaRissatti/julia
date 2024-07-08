import { Order } from "@/app/(components)/Order/Order";

export interface BuyProduct extends Order {
	// pedido: number;
	// item: number;
	emissao: Date;
	entrega: Date;
	// cliente: string;
	eqtn: string;
	perfil: string;
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