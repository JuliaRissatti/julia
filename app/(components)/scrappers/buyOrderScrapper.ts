import { Line, Page } from "tesseract.js";

import { BuyOrder } from "@/app/models/item/buy-order";
import { BuyProduct } from "@/app/models/item/buy-product";

export default function readBuyOrder(pages: Array<Page>): Array<BuyOrder> {
	// Concatenate all Lines from all Pages
	const lines = pages.reduce((lines: Array<Line>, page) => lines.concat(page.lines), new Array<Line>());

	const header = extractHeader(lines.slice(0, 2));

	let table = extractBuyOrders(lines.slice(3, undefined));

	table = filterTable(header.pedido);

	// const buyOrderTable = lines.slice(buyOrderTableHeader + 1, buyOrderTableFooter);

	// const buyOrderLines: Array<Array<Line>> = extractBuyOrderLines(buyOrderTable);

	// const buyOrderString: Array<RawBuyOrder> = buyOrderLines.map((lines) => convertToString(lines));

	// const buyOrder: Array<BuyOrder> = buyOrderString.map((rawBuyOrder) => convertToBuyOrder(rawBuyOrder));

	// return buyOrder;
}

/*
 * Espera-se que todos os PDFs de compra tenham as três primeiras linhas da seguinte forma:
 *
 * 1. Matriz
 * 2. Volumes para Embarque - (todos)
 * 3. Semana Corrente {número de semanas decorridas no ano} de {Período de emissão do pedido} - - Pedido = {Número do Pedido} - {Período de ?}
 */
function extractHeader(lines: Array<Line>): { matrix: string; title: string; order: string } {
	const headerLines = lines.slice(0, 2);

	const matrix = headerLines.at(0)!.text;

	const titleString = headerLines.at(1)!.text;
	const titleRegExp = new RegExp(`^(?<titulo>Volumes\\spara\\sEmbarque)`, "g");
	const titleRegExpExec = titleRegExp.exec(titleString);
	const title = titleRegExpExec?.at(1);

	if (!title) throw new Error(`Não parece ser um arquivo de "Volumes para Embarque".`);

	const orderString = headerLines.at(2)!.text;
	const orderRegExp = new RegExp(`Pedido\\s=\\s(?<order>\\d+)`, "g");
	const orderRegExpExec = orderRegExp.exec(orderString);
	const order = orderRegExpExec?.at(1);

	if (!order) throw new Error(`Não foi possível ler qual é o número desse pedido.`);

	return { matrix, title, order };
}

function extractBuyOrders(lines: Array<Line>, order: string) {
	const totalGeralIndex = lines.findIndex((line: Line) => line.text.includes("Total Geral"));

	const itemRegExp = new RegExp(`^(?<item>)\\w+-\\d+`, `g`);
	const subitemRegExp = new RegExp(`^(?<subitem>)` + order, `g`);
	const subtotalRegExp = new RegExp(`^(?<subTotal>Sub-Total)`, `g`);

	const buyOrders: Array<BuyOrder> = new Array<BuyOrder>();

	for (const line of lines.slice(0, totalGeralIndex)) {
		const text = line.text;

		const lastBuyOrder = buyOrders?.at(-1);

		if (itemRegExp.test(text)) {
			const order = interpretItem(text);
			buyOrders.push(order);
		} else if (subitemRegExp.test(text)) {
			const item = interpretSubitem(text, order);
			lastBuyOrder!.items.push(item);
		} else if (subtotalRegExp.test(text)) {
			const subtotal = interpretSubtotal(text);
			lastBuyOrder!.subtotal = subtotal;
		} else {
			// ignore
		}
	}

	return buyOrders;
}

function interpretItem(text: string): BuyOrder {
	const itemRegExp = new RegExp(`^(?<item>)\\w+-\\d+`, `g`);
	const pedidoRegExpExec = itemRegExp.exec(text);
	const pedido = pedidoRegExpExec?.at(1);

	// Podemos, se necessário, interpretar a transportadora e o beneficiador

	const item: BuyOrder = { order: Number(pedido), items: new Array<BuyProduct>(), subtotal: undefined };

	return item;
}

function interpretSubitem(text: string, order: string): BuyProduct {
	const [firstString, secondString] = splitLineInTwo(text, order);

	const { pedido, item, emissao, entrega, cliente, eqtn, produto, beneficiario } = readFirstString(firstString, order);
	const { liga, tamanho, corte, amarracoes, pecas, liquido, bruto, solicitado, atendido, ca, observacao, etiqueta } =
		readSecondString(secondString);

	const buyProduct: BuyProduct = {
		pedido: parseInt(pedido),
		item: parseInt(item),
		emissao: new Date(emissao),
		entrega: new Date(entrega),
		cliente: cliente,
		eqtn: eqtn,
		produto: produto,
		beneficiario: beneficiario,
		liga: parseInt(liga),
		tamanho: tamanho,
		corte: parseInt(corte),
		amarracoes: parseInt(amarracoes),
		pecas: parseInt(pecas),
		liquido: parseFloat(liquido),
		bruto: parseFloat(bruto),
		solicitado: parseInt(solicitado),
		atendido: parseInt(atendido),
		ca: ca,
		observacao: observacao,
		etiqueta: etiqueta,
	};

	return buyProduct;
}

function interpretSubtotal(text: string): BuyOrder["subtotal"] {
	const subtotalRegExp = new RegExp(
		[
			`(?<produto>\\w-\\d+)`,
			`(?<amarracoes>\\d+\\samr)`,
			`(?<pecas>\\d+\\spçs)`,
			`(?<liquido>\\b\\d+,\\d{2})`,
			`(?<bruto>\\b\\d+,\\d{2}\\skg)`,
		].join("\\s"),
		"g"
	);

	const [, produto, amarracoes, pecas, liquido, bruto] = subtotalRegExp.exec(text) || [];

	const subtotal: BuyOrder["subtotal"] = {
		produto: Number(produto),
		amarracoes: parseInt(amarracoes),
		pecas: parseInt(pecas),
		liquido: parseFloat(liquido),
		bruto: parseFloat(bruto),
	};

	return subtotal;
}

/*
 * A estratégia para obter todos os atributos do item começa por dividir todas as
 * informações da linha em duas partes, as quais podemos delimitar mais seguramente:
 *
 *  Pedido	 Beneficiário   Tamaho       Etiqueta
 * [ - - - - - - - - - - ] [ - - - - - - - - - - ]
 */
function splitLineInTwo(text: string, order: string) {
	const regexPerfil = new RegExp(`(?<perfil>` + order + `)`, "g");
	const indexPerfil = regexPerfil.exec(text)?.index;
	if (!indexPerfil) throw new Error();

	const firstBlockStart = 0;
	const firstBlockEnd = indexPerfil + order.length;
	const firstBlock = text.substring(firstBlockStart, firstBlockEnd);

	const secondBlockStart = firstBlockEnd;
	const secondBlockEnd = undefined;
	const secondBlock = text.substring(secondBlockStart, secondBlockEnd);

	return new Array<string>(firstBlock.trim(), secondBlock.trim());
}

/*
	Para o este conjunto de instruções, convém preparar o texto
	retirando todos os espaços em branco.

	1. Encontrar <Pedido> por RegEx de número
	2. Encontrar <Emissão> por RegEx de data
	3. Deduzir <Item> que deve estar localizado entre pedido e emissão
	4. Encontrar <Entrega> por RegEx de data
	5. Encontrar <Perfil> por RegEx de correspondência exata
	6. Deduzir <EqTn> buscando dois caracteres para trás do início de perfil
	7. Ignorar <Cliente> e <Beneficiário>
 */
function readFirstString(text: string, productId: string) {
	text.replaceAll(" ", "");

	if (!text) throw new Error("text");

	const pedidoString = text;
	const pedidoRegExp = new RegExp(`^(?<pedido>\\d+\\b)`, "g");
	const pedidoRegExpExec = pedidoRegExp.exec(pedidoString);
	const pedido = pedidoRegExpExec?.at(1);

	if (!pedido) throw new Error("pedido");

	const emissaoString = text;
	const emissaoRegExp = new RegExp(`(?<emissao>\\d{2}\\/\\d{2}\\/\\d{4})`, "g");
	const emissaoRegExpExec = emissaoRegExp.exec(emissaoString);
	const emissao = emissaoRegExpExec?.at(1);

	if (!emissao) throw new Error("emissao");

	const item = text.substring(pedidoRegExp?.lastIndex, emissaoRegExpExec?.index);

	if (!item) throw new Error("item");

	const entregaString = text.substring(emissaoRegExp?.lastIndex, undefined);
	const entregaRegExp = new RegExp(`(?<entrega>\\d{2}\\/\\d{2}\\/\\d{4})`, "g");
	const entregaRegExpExec = entregaRegExp.exec(entregaString);
	const entrega = entregaRegExpExec?.at(1);

	if (!entrega) throw new Error("entrega");

	const produtoString = text;
	const produtoRegExp = new RegExp(`(?<produto>` + productId + `)`, "g");
	const produtoRegExpExec = produtoRegExp.exec(produtoString);
	const produto = produtoRegExpExec?.at(1);

	if (!produto) throw new Error("perfil");

	const eqtn = text.substring(produtoRegExpExec!.index - 2, produtoRegExpExec!.index);

	if (!eqtn) throw new Error("eqtn");

	const cliente = entregaString.substring(entregaRegExp?.lastIndex, produtoRegExpExec!.index - eqtn.length);

	if (!cliente) throw new Error("cliente");

	const beneficiario = " ";

	if (!beneficiario) throw new Error("beneficiario");

	return { pedido, item, emissao, entrega, cliente, eqtn, produto, beneficiario };
}

/*
	8.  Encontrar <Tamanho> por RegEx de correspondência exata
	9.  Deduzir <Liga> que deve estar localizada do início até o começo do Tamanho
	10. Encontrar <Corte> por RegEx de número
	11. Encontrar <Amarrações> por RegEx de número
	12. Encontrar <Peças> por RegEx de número
	13. Encontrar <Líquido> por RegEx de número formatado com duas casas após a vírgula
	14. Encontrar <Bruto> por RegEx de número formatado com duas casas após a vírgula
	15. Encontrar <Solicitado> por RegEx de número
	16. Encontrar <Atendido> por RegEx de número
	17. Encontrar <CA> por RegEx de correspondência exata
	18. Deduzir <Observação> que deve estar localizado após CA
 */
function readSecondString(text: string) {
	const tamanhoString = text;
	const tamanhoRegExp = new RegExp(`(?<tamanho>T\\d{1})`, "g");
	const tamanhoRegExpExec = tamanhoRegExp.exec(tamanhoString);
	const tamanho = tamanhoRegExpExec?.at(1);

	if (!tamanho) throw new Error("tamanho");

	const ligaString = text.substring(0, tamanhoRegExpExec?.index);
	const liga = ligaString.trim();

	if (!liga) throw new Error("liga");

	const corteString = text.substring(tamanhoRegExp.lastIndex, undefined);
	const corteRegExp = new RegExp(`(?<corte>\\b\\d+)`, "g");
	const corteRegExpExec = corteRegExp.exec(corteString);
	const corte = corteRegExpExec?.at(1);

	if (!corte) throw new Error("corte");

	const amarracoesString = corteString.substring(corteRegExp.lastIndex, undefined);
	const amarracoesRegExp = new RegExp(`(?<amarracoes>\\b\\d+)`, "g");
	const amarracoesRegExpExec = amarracoesRegExp.exec(amarracoesString);
	const amarracoes = amarracoesRegExpExec?.at(1);

	if (!amarracoes) throw new Error("amarracoes");

	const pecasString = amarracoesString.substring(amarracoesRegExp.lastIndex, undefined);
	const pecasRegExp = new RegExp(`(?<pecas>\\b\\d+)`, "g");
	const pecasRegExpExec = pecasRegExp.exec(pecasString);
	const pecas = pecasRegExpExec?.at(1);

	if (!pecas) throw new Error("pecas");

	const liquidoString = pecasString.substring(pecasRegExp.lastIndex, undefined);
	const liquidoRegExp = new RegExp(`(?<liquido>\\b\\d+,\\d{2})`, "g");
	const liquidoRegExpExec = liquidoRegExp.exec(liquidoString);
	const liquido = liquidoRegExpExec?.at(1);

	if (!liquido) throw new Error("liquido");

	const brutoString = liquidoString.substring(liquidoRegExp.lastIndex, undefined);
	const brutoRegExp = new RegExp(`(?<bruto>\\b\\d+,\\d{2})`, "g");
	const brutoRegExpExec = brutoRegExp.exec(brutoString);
	const bruto = brutoRegExpExec?.at(1);

	if (!bruto) throw new Error("bruto");

	const solicitadoString = brutoString.substring(liquidoRegExp.lastIndex, undefined);
	const solicitadoRegExp = new RegExp(`(?<solicitado>\\b\\d+)`, "g");
	const solicitadoRegExpExec = solicitadoRegExp.exec(solicitadoString);
	const solicitado = solicitadoRegExpExec?.at(1);

	if (!solicitado) throw new Error("bruto");

	const caString = text;
	const caRegExp = new RegExp(`(?<ca>\\bN)`, "g");
	const caRegExpExec = caRegExp.exec(caString);
	const ca = caRegExpExec?.at(1);

	if (!ca) throw new Error("ca");

	const atendidoString = solicitadoString.substring(solicitadoRegExp.lastIndex, caRegExpExec?.index);
	const atendido = atendidoString.trim();

	if (!atendido) throw new Error("atendido");

	const observacaoString = text;
	const observacaoRegExp = new RegExp(`%`, "g");
	const observacaoRegExpExec = observacaoRegExp.exec(observacaoString);
	const observacao = text.substring(caRegExp.lastIndex, observacaoRegExp.lastIndex);

	if (!observacao) throw new Error("observacao");

	const etiquetaString = observacaoString.substring(observacaoRegExp.lastIndex, undefined);
	const etiquetaRegExp = new RegExp(`(?<etiqueta>\\b\\d+)`, "g");
	const etiquetaRegExpExec = etiquetaRegExp.exec(etiquetaString);
	const etiqueta = etiquetaRegExpExec?.at(1);

	if (!etiqueta) throw new Error("etiqueta");

	return { liga, tamanho, corte, amarracoes, pecas, liquido, bruto, solicitado, atendido, ca, observacao, etiqueta };
}
