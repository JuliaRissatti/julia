export interface SellProduct {
	item: number;
	produto: string;
	beneficiario: string;
	seuCodigo: string;
	liga: number;
	tamanho: string;
	corte: number;
	pecas: number;
	peso: number;
	preco: number;
	porcentagemIpi: number;
	valorIpi: number;
	valorDoItem: number;
	smn: string;
	entrega: Date;
}

export interface RawSellProduct {
	item: string;
	produto: string;
	beneficiario: string;
	seuCodigo: string;
	liga: string;
	tamanho: string;
	corte: string;
	pecas: string;
	peso: string;
	preco: string;
	porcentagemIpi: string;
	valorIpi: string;
	valorDoItem: string;
	smn: string;
	entrega: string;
}