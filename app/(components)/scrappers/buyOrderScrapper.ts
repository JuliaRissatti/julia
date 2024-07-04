import { Line, Page } from "tesseract.js";
import { BuyOrder, RawBuyOrder } from "@/app/models/item/buy-product";
import { BuyProduct, RawBuyProduct } from "@/app/models/item/buy-order";

export default function readBuyOrder(orderId: string, pages: Array<Page>) {
	// Concatenate all Lines from all Pages
	const lines = pages.reduce((lines: Array<Line>, page) => lines.concat(page.lines), new Array<Line>());

	// Find the order's table beggining
	const buyOrderTableHeader = lines.findIndex((line: Line) => line.text.includes("Pedido/Item"));
	if (buyOrderTableHeader < 0) throw Error("Não foi possível encontrar o início da tabela de pedidos.");

	// Find the order's table ending
	const buyOrderTableFooter = lines.findIndex((line: Line) => line.text.includes("Total Geral"));
	if (buyOrderTableFooter < 0) throw Error("Não foi possível encontrar o fim da tabela de pedidos.");

	const buyOrderTable = lines.slice(buyOrderTableHeader + 1, buyOrderTableFooter);

	const buyOrderLines: Array<Array<Line>> = extractBuyOrderLines(buyOrderTable);

	const buyOrderString: Array<RawBuyOrder> = buyOrderLines.map((lines) => convertToString(lines, orderId));

	const buyOrder: Array<BuyOrder> = buyOrderString.map((rawBuyOrder) => convertToBuyOrder(rawBuyOrder));

	return buyOrder;
}

function extractBuyOrderLines(buyOrderTable: Array<Line>) {
	const ordersLines = new Array<Array<Line>>();

	let lastIndex = 0;
	buyOrderTable.forEach((line: Line, index: number) => {
		if (line.text.includes("Sub-Total")) {
			const data = buyOrderTable.slice(lastIndex, index + 1);
			ordersLines.push(data);
			lastIndex = index + 1;
		}
	});

	return ordersLines;
}

function convertToString(product: Array<Line>, orderId: string) {
	if (product.length < 3) throw new Error("Não rolou nem receber as linhas do produto");

	const headerLine = product.at(0);
	const itemLines = product.slice(1, -1);
	const subtotalLine = product.at(-1);

	if (!headerLine || !itemLines || !subtotalLine) throw new Error("Não rolou montar as linhas do produto ae");

	const productId = readHeader(headerLine);

	const items: Array<RawBuyProduct> = readItems(itemLines, orderId, productId);

	const subtotal = readSubtotal(productId, subtotalLine.text);

	return { orderId, productId, items, subtotal };
}

function readHeader(line: Line) {
	return line.text.split(" ")[0];
}

function readItems(items: Array<Line>, orderId: string, productId: string): Array<RawBuyProduct> {
	return items.map((line: Line) => {
		const [firstString, secondString] = splitLineInTwo(productId, line);

		const firstPart = readFirstString(firstString, orderId, productId);
		const secondPart = readSecondString(secondString);

		return { ...firstPart, ...secondPart };
	});
}

function readSubtotal(produto: string, subtotalString: string) {
	const amarracoesRegExp = `(?<amarracoes>\\s\\d+\\s)`;
	const pecasRegExp = `(?<pecas>\\s\\d+\\s)`;
	const liquidoRegExp = `(?<liquido>\\b\\d+,\\d{2})`;
	const brutoRegExp = `(?<bruto>\\b\\d+,\\d{2})`;

	const subtotalRegExp = new RegExp([amarracoesRegExp, pecasRegExp, liquidoRegExp, brutoRegExp].join(".*"), "g");
	const [, amarracoes, pecas, liquido, bruto] = subtotalRegExp.exec(subtotalString) || [];

	return { produto, amarracoes, pecas, liquido, bruto };
}

/*
 * A estratégia para obter todos os atributos do item começa por dividir todas as
 * informações da linha em duas partes, as quais podemos delimitar mais seguramente:
 *
 *  Pedido	 Beneficiário   Tamaho       Etiqueta
 * [ - - - - - - - - - - ] [ - - - - - - - - - - ]
 */
function splitLineInTwo(product: string, line: Line) {
	const text = line.text;

	const regexPerfil = new RegExp(`(?<perfil>` + product + `)`, "g");
	const indexPerfil = regexPerfil.exec(text)?.index;
	if (!indexPerfil) throw new Error();

	const firstBlockStart = 0;
	const firstBlockEnd = indexPerfil + product.length;
	const firstBlock = text.substring(firstBlockStart, firstBlockEnd);

	const secondBlockStart = firstBlockEnd;
	const secondBlockEnd = undefined;
	const secondBlock = text.substring(secondBlockStart, secondBlockEnd);

	return new Array<string>(firstBlock.trim(), secondBlock.trim());
}

/*
	Para o este conjunto de instruções, convém preparar o texto
	retirando todos os espaços em branco.

	1. Encontrar <Pedido> por RegEx de correspondência exata
	2. Encontrar <Emissão> por RegEx de data
	3. Deduzir <Item> que deve estar localizado entre pedido e emissão
	4. Encontrar <Entrega> por RegEx de data
	5. Encontrar <Perfil> por RegEx de correspondência exata
	6. Deduzir <EqTn> buscando dois caracteres para trás do início de perfil
	7. Ignorar <Cliente> e <Beneficiário>
 */
function readFirstString(text: string, orderId: string, productId: string) {
	text.replaceAll(" ", "");

	if (!text) throw new Error("text");

	const pedidoString = text;
	const pedidoRegExp = new RegExp(`^(?<pedido>` + orderId + `)`, "g");
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

function convertToBuyOrder(rawBuyOrder: RawBuyOrder) {
	const orderId: BuyOrder["orderId"] = Number(rawBuyOrder.orderId);

	const productId: BuyOrder["productId"] = rawBuyOrder.productId;

	const items: BuyOrder["items"] = rawBuyOrder.items.map((rawBuyProduct) => {
		const buyItem: BuyProduct = {
			pedido: parseInt(rawBuyProduct.pedido),
			item: parseInt(rawBuyProduct.item),
			emissao: new Date(rawBuyProduct.emissao),
			entrega: new Date(rawBuyProduct.entrega),
			cliente: rawBuyProduct.cliente,
			eqtn: rawBuyProduct.eqtn,
			produto: rawBuyProduct.produto,
			beneficiario: rawBuyProduct.beneficiario,
			liga: parseInt(rawBuyProduct.liga),
			tamanho: rawBuyProduct.tamanho,
			corte: parseInt(rawBuyProduct.corte),
			amarracoes: parseInt(rawBuyProduct.amarracoes),
			pecas: parseInt(rawBuyProduct.pecas),
			liquido: parseFloat(rawBuyProduct.liquido),
			bruto: parseFloat(rawBuyProduct.bruto),
			solicitado: parseInt(rawBuyProduct.solicitado),
			atendido: parseInt(rawBuyProduct.atendido),
			ca: rawBuyProduct.ca,
			observacao: rawBuyProduct.observacao,
			etiqueta: rawBuyProduct.etiqueta,
		};

		return buyItem;
	});

	const subtotal: BuyOrder["subtotal"] = {
		produto: rawBuyOrder.subtotal.produto,
		amarracoes: parseInt(rawBuyOrder.subtotal.amarracoes),
		pecas: parseInt(rawBuyOrder.subtotal.pecas),
		liquido: parseFloat(rawBuyOrder.subtotal.liquido),
		bruto: parseFloat(rawBuyOrder.subtotal.bruto),
	};

	return { orderId, productId, items, subtotal };
}
