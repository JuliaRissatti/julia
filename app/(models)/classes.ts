import { Line } from "tesseract.js";

export class Client {
	name: string | undefined = undefined;
	orders: Array<Order> = new Array<Order>();

	constructor(lines: Array<Line>) {
		this.name = lines.at(0)?.text.split(" ").slice(1).join(" ");

		for (const line of lines.slice(1, -1)) {
			this.orders.push(new Order(line));
		}
	}
}

class Order {
	number: number;

	filial: number | undefined;
	serie: number | undefined;
	nota: number | undefined;
	data: number | undefined;
	t_saida: string | undefined;
	peso: number | undefined;
	valor_da_nota: number | undefined;
	icm: number | undefined;
	v_icms: number | undefined;
	v_icms_st: number | undefined;
	valor_ipi: number | undefined;
	valor_pis: number | undefined;
	v_cofins: number | undefined;
	preço_bruto_liquido: number | undefined;
	condicao_pagamento: number | undefined;
	p_md: number | undefined;

	constructor(line: Line) {
		this.number = Number(line.words.at(-1)?.text);
	}
}

class Item {
	pedido: number | undefined;
	item: number | undefined;
	emissao: number | undefined;
	entrega: number | undefined;
	cliente: string | undefined;
	eqtn: number | undefined;
	perfil: number | undefined;
	beneficiario: number | undefined;
	liga: number | undefined;
	tamanho: number | undefined;
	corte: number | undefined;
	amr: number | undefined;
	pecas: number | undefined;
	liquido: number | undefined;
	bruto: number | undefined;
	solicitado: number | undefined;
	atendido: number | undefined;
	ca: number | undefined;
	observacao: number | undefined;
	etiqueta: number | undefined;
}

/*
Filial Série Nota  Data       T.Saída  Peso (kg)  Valor da Nota  ICM  V.ICMS  V.ICMS-ST  Valor IPI  Valor PIS  V.COFINS  Preço Bruto / Líquido  Condição Pagamento  P.Md.

01212 ACO METAIS FRAIBURGO
00           52876 23/05/2024 00113    942,24     4.400,27       0    0,00    0,00       0,00       72,60      334,42    4,67                   A 07 Pedido: 22947
00           52876 23/05/2024 00126    942,24     4.400,26       0    0,00    0,00       0,00       72,60      334,42    4,67                   A
Sub-Total ACO METAIS FRAIBURGO         1.884,48
*/
