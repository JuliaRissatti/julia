import { Line, Page } from "tesseract.js";

import { BuyOrder } from "@/app/models/item/buy-order";
import { BuyProduct } from "@/app/models/item/buy-product";

export default function readBuyOrder(pages: Array<Page>): Array<BuyOrder> {
	// Concatenate all Lines from all Pages
	const lines = pages.reduce((lines: Array<Line>, page) => lines.concat(page.lines), new Array<Line>());

	const headerLines = lines.slice(0, 3);
	const header = extractHeader(headerLines);

	const buyOrderLines = lines.slice(3, undefined);
	const buyOrders = extractBuyOrders(buyOrderLines, header.order);

	return buyOrders;
}

/*
 * Espera-se que todos os PDFs de compra tenham as três primeiras linhas da seguinte forma:
 *
 * 1. Matriz
 * 2. Volumes para Embarque - (todos)
 * 3. Semana Corrente {número de semanas decorridas no ano} de {Período de emissão do pedido} - - Pedido = {Número do Pedido} - {Período de ?}
 */
function extractHeader(headerLines: Array<Line>): { matrix: string; title: string; order: string } {
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
			const buyOrder = interpretItem(text, order);
			buyOrders.push(buyOrder);
		} else if (subitemRegExp.test(text)) {
			if (!lastBuyOrder) throw new Error("Tentando criar Subitem sem ter um Item");
			const item = interpretSubitem(text, lastBuyOrder);
			lastBuyOrder!.items.push(item);
		} else if (subtotalRegExp.test(text)) {
			if (!lastBuyOrder) throw new Error("Tentando criar Subtotal sem ter um Item");
			const subtotal = interpretSubtotal(text, lastBuyOrder);
			lastBuyOrder!.subtotal = subtotal;
		} else {
			// ignore
		}
	}

	return buyOrders;
}

function interpretItem(text: string, order: string): BuyOrder {
	const item = text.split(" ").at(0);

	if (!item) throw new Error("Item");

	// Transporte ?

	// Beneficiador ?

	const buyOrder: BuyOrder = { order, item, items: new Array<BuyProduct>(), subtotal: undefined };

	return buyOrder;
}

/*
  A estratégia para obter todos os atributos do item começa por dividir todas as
  informações da linha em duas partes, as quais podemos delimitar mais seguramente:
 
   Pedido	 Beneficiário   Tamaho       Etiqueta
  [ - - - - - - - - - - ] [ - - - - - - - - - - ]
 
	Para o este conjunto de instruções, convém preparar o texto
	retirando todos os espaços em branco.

	1. Encontrar <Pedido> por RegEx de número
	2. Encontrar <Emissão> por RegEx de data
	3. Deduzir <Item> que deve estar localizado entre pedido e emissão
	4. Encontrar <Entrega> por RegEx de data
	5. Encontrar <Perfil> por RegEx de correspondência exata
	6. Deduzir <EqTn> buscando dois caracteres para trás do início de perfil
	7. Ignorar <Cliente> e <Beneficiário>
	
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
function interpretSubitem(text: string, buyOrder: BuyOrder) {
	const [textBeforePerfil, textAfterPerfil] = text.split(buyOrder.item);

	const [, pedido, item, emissao, entrega, cliente, eqtn] =
		new RegExp(
			[
				`^(?<pedido>` + buyOrder.order + `)`,
				`(?<item>\\d+)`,
				`(?<emissao>\\d{2}\\/\\d{2}\\/\\d{4})`,
				`(?<entrega>\\d{2}\\/\\d{2}\\/\\d{4})`,
				`(?<cliente>\\w)`,
				`(?<eqtn>\\w\\d)`,
			].join(),
			`g`
		).exec(textBeforePerfil.replaceAll(" ", "")) || [];

	const [, liga, tamanho, corte, amarracoes, pecas, liquido, bruto, solicitado, atendido, ca, observacao] =
		new RegExp(
			[
				`(?<liga>\\d+)`,
				`(?<tamanho>[\\w|\\d]{2})`,
				`(?<corte>\\d+)`,
				`(?<amarracoes>\\d+)`,
				`(?<pecas>\\d+)`,
				`(?<liquido>\\d+,\\d{2})`,
				`(?<bruto>\\d+,\\d{2})`,
				`(?<solicitado>\\d+)`,
				`(?<atendido>\\[\\w+|\\d+])`,
				`(?<ca>N)`,
				`(?<observacao>\\d+,\\d{2}%)`,
			].join("\\s*"),
			`g`
		).exec(textAfterPerfil) || [];

	const buyProduct = {
		pedido: Number(pedido),
		item: Number(pedido),
		emissao: new Date(emissao),
		entrega: new Date(entrega),
		cliente,
		eqtn,
		perfil: buyOrder.item,
		beneficiario: "",
		liga: Number(pedido),
		tamanho,
		corte: Number(pedido),
		amarracoes: Number(pedido),
		pecas: Number(pedido),
		liquido: Number(pedido),
		bruto: Number(pedido),
		solicitado: Number(pedido),
		atendido: Number(pedido),
		ca,
		observacao,
		etiqueta: "",
	};

	return buyProduct;
}

function interpretSubitem_Old(text: string, buyOrder: BuyOrder): BuyProduct {
	text = text.trim();

	const perfilString = text;
	const perfilRegExp = new RegExp(`(?<perfil>` + buyOrder.item + `)`, "g");
	const perfilRegExpExec = perfilRegExp.exec(perfilString);
	const perfil = perfilRegExpExec?.at(1);

	if (!perfil) throw new Error("Perfil");

	const pedidoString = text;
	const pedidoRegExp = new RegExp(`^(?<pedido>` + buyOrder.order + `)`, "g");
	const pedidoRegExpExec = pedidoRegExp.exec(pedidoString);
	const pedido = pedidoRegExpExec?.at(1);

	if (!pedido) throw new Error("Pedido");

	const emissaoString = text.substring(pedidoRegExp.lastIndex, perfilRegExpExec?.index);
	const emissaoRegExp = new RegExp(`(?<emissao>\\d{2}\\/\\d{2}\\/\\d{4})`, "g");
	const emissaoRegExpExec = emissaoRegExp.exec(emissaoString);
	const emissao = emissaoRegExpExec?.at(1);

	if (!emissao) throw new Error("Emissão");

	const item = text.substring(pedidoRegExp?.lastIndex, emissaoRegExpExec?.index);

	if (!item) throw new Error("Item");

	const entregaString = text.substring(emissaoRegExp?.lastIndex, perfilRegExpExec?.index);
	const entregaRegExp = new RegExp(`(?<entrega>\\d{2}\\/\\d{2}\\/\\d{4})`, "g");
	const entregaRegExpExec = entregaRegExp.exec(entregaString);
	const entrega = entregaRegExpExec?.at(1);

	if (!entrega) throw new Error("Entrega");

	const eqtn = text.substring(perfilRegExpExec!.index - 2, perfilRegExpExec!.index);

	if (!eqtn) throw new Error("EqTn");

	const cliente = text.substring(entregaRegExp?.lastIndex, perfilRegExpExec!.index - eqtn.length);

	if (!cliente) throw new Error("Cliente");

	const beneficiario = " "; //-> ""

	if (!beneficiario) throw new Error("Beneficiário");

	const tamanhoString = text.substring(perfilRegExp.lastIndex, undefined);
	const tamanhoRegExp = new RegExp(`(?<tamanho>T\\d{1})`, "g");
	const tamanhoRegExpExec = tamanhoRegExp.exec(tamanhoString);
	const tamanho = tamanhoRegExpExec?.at(1);

	if (!tamanho) throw new Error("tamanho");

	const ligaString = text.substring(perfilRegExp.lastIndex, tamanhoRegExpExec?.index);
	const liga = ligaString.trim();

	if (!liga) throw new Error("liga");

	const corteString = text.substring(tamanhoRegExp.lastIndex, undefined);
	const corteRegExp = new RegExp(`(?<corte>\\d+)`, "g");
	const corteRegExpExec = corteRegExp.exec(corteString);
	const corte = corteRegExpExec?.at(1);

	if (!corte) throw new Error("corte");

	const amarracoesString = corteString.substring(corteRegExp.lastIndex, undefined);
	const amarracoesRegExp = new RegExp(`(?<amarracoes>\\d+)`, "g");
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

	const buyProduct = {
		pedido: Number(pedido),
		item: Number(pedido),
		emissao: new Date(emissao),
		entrega: new Date(entrega),
		cliente,
		eqtn,
		perfil,
		beneficiario,
		liga: Number(pedido),
		tamanho,
		corte: Number(pedido),
		amarracoes: Number(pedido),
		pecas: Number(pedido),
		liquido: Number(pedido),
		bruto: Number(pedido),
		solicitado: Number(pedido),
		atendido: Number(pedido),
		ca,
		observacao,
		etiqueta,
	};

	return buyProduct;

	/*
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
	*/
}

function interpretSubtotal(text: string, buyOrder: BuyOrder): BuyOrder["subtotal"] {
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
		produto: produto,
		amarracoes: parseInt(amarracoes),
		pecas: parseInt(pecas),
		liquido: parseFloat(liquido),
		bruto: parseFloat(bruto),
	};

	return subtotal;
}
