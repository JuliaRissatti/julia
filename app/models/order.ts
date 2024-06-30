import { Line } from "tesseract.js";

export class Order {
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
