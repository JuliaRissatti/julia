import { Page, Line } from "tesseract.js";

import { RawSellProduct } from "@/app/models/item/sell-product";

export default function readSellOrder(orderNumber: number | undefined, pages: Array<Page>) {
	// Concatenate all Lines from all Pages
	const lines = pages.reduce((lines: Array<Line>, page) => lines.concat(page.lines), new Array<Line>());

	// Find the sell order's table beggining
	const sellOrderTableHeader = lines.findIndex((line: Line) => line.text.includes("Construtora"));
	if (sellOrderTableHeader < 0) throw Error("Não foi possível encontrar o início da tabela de pedidos.");

	// Find the sell order's table ending
	const sellOrderTableFooter = lines.findIndex((line: Line) => line.text.includes("Total"));
	if (sellOrderTableFooter < 0) throw Error("Não foi possível encontrar o fim da tabela de pedidos.");

	const sellOrderTable = lines.slice(sellOrderTableHeader + 2, sellOrderTableFooter);

	const sellOrdersLines = extractSellOrdersLines(sellOrderTable);

	const sellOrderString = sellOrdersLines.map((product) => convertToString(product));

	const sellOrder = sellOrderString.map((product) => convertToSellOrder(product));

	return { orderNumber, items: sellOrder };
}

function extractSellOrdersLines(sellOrderTable: Array<Line>) {
	const orderLines = new Array<Array<Line>>();

	let index = 0;
	sellOrderTable.forEach((line) => {
		const itemRegExp = new RegExp(`^(?<item>\\d+\\b)`, "g");
		const itemRegExpExec = itemRegExp.exec(line.text);
		const itemString = itemRegExpExec?.at(1);
		const item = Number(itemString);

		if (item === index + 1) {
			index = index + 1;
			orderLines.push(new Array<Line>(line));
		} else {
			orderLines.at(index - 1)?.push(line);
		}
	});

	return orderLines;
}

/*
	1. Encontrar <Produto> por RegEx de correspondência exata
	2. <Item>
	3. <Seu Código>
	4. dps
	5. fazer
	6. isso
	7. aki
 */
function convertToString(productLines: Array<Line>) {
	const text = productLines.at(0)?.text;

	if (!text) throw new Error("text");

	const itemString = text;
	const itemRegExp = new RegExp(`^(?<item>\\d+\\b)`, "g");
	const itemRegExpExec = itemRegExp.exec(itemString);
	const item = itemRegExpExec?.at(1);

	if (!item) throw new Error("item");

	const produtoString = itemString.substring(itemRegExp.lastIndex, undefined);
	const produtoRegExp = new RegExp(`(?<produto>\\w+-\\d+)`, "g");
	const produtoRegExpExec = produtoRegExp.exec(produtoString);
	const produto = produtoRegExpExec?.at(1);

	if (!produto) throw new Error("produto");

	const beneficiarioString = produtoString.substring(produtoRegExp.lastIndex, undefined);
	const beneficiarioRegExp = new RegExp(`(?<beneficiario>\\w+\\b)`, "g");
	const beneficiarioRegExpExec = beneficiarioRegExp.exec(beneficiarioString);
	const beneficiario = beneficiarioRegExpExec?.at(1);

	if (!beneficiario) throw new Error("beneficiario");

	const tamanhoString = beneficiarioString.substring(beneficiarioRegExp.lastIndex, undefined);
	const tamanhoRegExp = new RegExp(`(?<tamanho>T\\d+\\b)`, "g");
	const tamanhoRegExpExec = tamanhoRegExp.exec(tamanhoString);
	const tamanho = tamanhoRegExpExec?.at(1);

	if (!tamanho) throw new Error("tamanho");

	const ligaString = tamanhoString.substring(beneficiarioRegExp.lastIndex, tamanhoRegExpExec?.index);
	const ligaStringSplit = ligaString.trim().split(" ");
	const liga = ligaStringSplit.at(-1);

	if (!liga) throw new Error("liga");

	const corteString = tamanhoString.substring(tamanhoRegExp.lastIndex, undefined);
	const corteRegExp = new RegExp(`(?<corte>\\b\\d+\\b)`, "g");
	const corteRegExpExec = corteRegExp.exec(corteString);
	const corte = corteRegExpExec?.at(1);

	if (!corte) throw new Error("corte");

	const pecasString = corteString.substring(corteRegExp.lastIndex, undefined);
	const pecasRegExp = new RegExp(`(?<pecas>\\b\\d+\\b)`, "g");
	const pecasRegExpExec = pecasRegExp.exec(pecasString);
	const pecas = pecasRegExpExec?.at(1);

	if (!pecas) throw new Error("pecas");

	const pesoString = pecasString.substring(pecasRegExp.lastIndex, undefined);
	const pesoRegExp = new RegExp(`(?<peso>\\b\\d+\\b)`, "g");
	const pesoRegExpExec = pesoRegExp.exec(pesoString);
	const peso = pesoRegExpExec?.at(1);

	if (!peso) throw new Error("peso");

	const precoString = pesoString.substring(pesoRegExp.lastIndex, undefined);
	const precoRegExp = new RegExp(`(?<preco>\\b\\d+,\\d{2}\\b)`, "g");
	const precoRegExpExec = precoRegExp.exec(precoString);
	const preco = precoRegExpExec?.at(1);

	if (!preco) throw new Error("preco");

	const valorIpiString = precoString.substring(precoRegExp.lastIndex, undefined);
	const valorIpiRegExp = new RegExp(`(?<valorIpi>\\b\\d+,\\d{2}\\b)`, "g");
	const valorIpiRegExpExec = valorIpiRegExp.exec(valorIpiString);
	const valorIpi = valorIpiRegExpExec?.at(1);

	if (!valorIpi) throw new Error("valorIpi");

	const porcentagemIpiString = valorIpiString.substring(0, valorIpiRegExpExec?.index);
	const porcentagemIpi = porcentagemIpiString.trim();

	if (!porcentagemIpi) throw new Error("porcentagemIpi");

	const valorDoItemString = valorIpiString.substring(valorIpiRegExp.lastIndex, undefined);
	const valorDoItemRegExp = new RegExp(`(?<valorDoItem>\\b.*,\\d{2}\\b)`, "g");
	const valorDoItemRegExpExec = valorDoItemRegExp.exec(valorDoItemString);
	const valorDoItem = valorDoItemRegExpExec?.at(1);

	if (!valorDoItem) throw new Error("valorDoItem");

	const smnString = valorDoItemString.substring(valorDoItemRegExp.lastIndex, undefined);
	const smn = " ";

	if (!smn) throw new Error("smn");

	const entregaString = valorDoItemString.substring(valorDoItemRegExp.lastIndex, undefined);
	const entregaRegExp = new RegExp(`(?<entrega>\\d{2}\\/\\d{2}\\/\\d{4})`, "g");
	const entregaRegExpExec = entregaRegExp.exec(entregaString);
	const entrega = entregaRegExpExec?.at(1);

	if (!entrega) throw new Error("entrega");

	const seuCodigoString = ligaStringSplit.join();
	const seuCodigo = seuCodigoString;

	if (!seuCodigo) throw new Error("seuCodigo");

	return {
		item,
		produto,
		beneficiario,
		seuCodigo,
		liga,
		tamanho,
		corte,
		pecas,
		peso,
		preco,
		porcentagemIpi,
		valorIpi,
		valorDoItem,
		smn,
		entrega,
	};
}

function convertToSellOrder(rawSellProduct: RawSellProduct) {
	const item = parseInt(rawSellProduct.item);
	const produto = rawSellProduct.produto;
	const beneficiario = rawSellProduct.beneficiario;
	const seuCodigo = rawSellProduct.seuCodigo;
	const liga = parseInt(rawSellProduct.liga);
	const tamanho = rawSellProduct.tamanho;
	const corte = parseInt(rawSellProduct.corte);
	const pecas = parseInt(rawSellProduct.pecas);
	const peso = parseInt(rawSellProduct.peso);
	const preco = parseFloat(rawSellProduct.preco);
	const porcentagemIpi = parseInt(rawSellProduct.porcentagemIpi);
	const valorIpi = parseFloat(rawSellProduct.valorIpi);
	const valorDoItem = parseFloat(rawSellProduct.valorDoItem);
	const smn = rawSellProduct.smn;
	const entrega = new Date(rawSellProduct.entrega);

	return {
		item,
		produto,
		beneficiario,
		seuCodigo,
		liga,
		tamanho,
		corte,
		pecas,
		peso,
		preco,
		porcentagemIpi,
		valorIpi,
		valorDoItem,
		smn,
		entrega,
	};
}
