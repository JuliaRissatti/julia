import { BuyProduct } from "@/app/models/buy-product";
import { RawSellProduct, SellProduct } from "@/app/models/sell-product";
import { Page, Line } from "tesseract.js";

export default function readSellOrder(orderNumber: string, buyProducts: Array<BuyProduct>, pages: Array<Page>) {
	// Concatenate all Lines from all Pages
	const lines = pages.reduce((lines: Array<Line>, page) => lines.concat(page.lines), new Array<Line>());

	// Find the sell order's table beggining
	const sellOrderTableHeader = lines.findIndex((line: Line) => line.text.includes("Construtora"));
	if (sellOrderTableHeader < 0) throw Error("Não foi possível encontrar o início da tabela de pedidos.");

	// Find the sell order's table ending
	const sellOrderTableFooter = lines.findIndex((line: Line) => line.text.includes("Total"));
	if (sellOrderTableFooter < 0) throw Error("Não foi possível encontrar o fim da tabela de pedidos.");

	const sellOrderTable = lines.slice(sellOrderTableHeader + 2, sellOrderTableFooter);

	const rawSellItems = getRawItems(buyProducts, sellOrderTable);

	return rawSellItems.map((rawSellItem: RawSellProduct) => cookRawItem(rawSellItem));
}

function getRawItems(buyProducts: Array<BuyProduct>, sellOrderTable: Array<Line>) {
	const rawItems = new Array<RawSellProduct>();

	const productsId = buyProducts?.map((product) => product.id);

	productsId.forEach((id: string) => {
		const productIndex = sellOrderTable.findIndex((line) => line.text.includes(id.toString()));

		if (productIndex < 0) throw new Error("virrshhh");

		rawItems.push({ id: id, items: sellOrderTable.splice(productIndex, 2) });
	});

	return rawItems;
}

interface KnownItemValues {
	pedido: string;
	perfil: string;
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
function cookRawItem(rawSellItem: RawSellProduct) {
	const id = rawSellItem.id;
	const text = rawSellItem.items.at(0)?.text;

	if (!text) throw new Error("text");

	const produtoString = text;
	const produtoRegExp = new RegExp(`(?<produto>\\b` + id + `\\b)`, "g");
	const produtoRegExpExec = produtoRegExp.exec(produtoString);
	const produto = produtoRegExpExec?.at(1);

	if (!produto) throw new Error("produto");

	const itemString = text.substring(0, produtoRegExpExec?.index);
	const item = itemString.trim();

	if (!item) throw new Error("item");

	const beneficiarioString = produtoString.substring(produtoRegExp.lastIndex, undefined);
	const beneficiarioRegExp = new RegExp(`(?<beneficiario>\\b\\w+\\b)`, "g");
	const beneficiarioRegExpExec = beneficiarioRegExp.exec(beneficiarioString);
	const beneficiario = beneficiarioRegExpExec?.at(1);

	if (!beneficiario) throw new Error("beneficiario");

	const tamanhoString = beneficiarioString.substring(beneficiarioRegExp.lastIndex, undefined);
	const tamanhoRegExp = new RegExp(`(?<tamanho>\\bT\\d\\b)`, "g");
	const tamanhoRegExpExec = tamanhoRegExp.exec(tamanhoString);
	const tamanho = tamanhoRegExpExec?.at(1);

	if (!tamanho) throw new Error("tamanho");

	const ligaString = beneficiarioString.substring(beneficiarioRegExp.lastIndex, tamanhoRegExpExec?.index);
	const ligaStringSplit = ligaString.trim().split(" ");
	const liga = ligaStringSplit.splice(-1, 1).at(0);

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

	const smNEntregaString = valorDoItemString.substring(valorDoItemRegExp.lastIndex, undefined);
	const smNEntregaRegExp = new RegExp(`(?<smNEntrega>\\d{2}\\/\\d{2}\\/\\d{4})`, "g");
	const smNEntregaRegExpExec = smNEntregaRegExp.exec(smNEntregaString);
	const smNEntrega = smNEntregaRegExpExec?.at(1);

	if (!smNEntrega) throw new Error("smNEntrega");

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
		smNEntrega,
	};
}
