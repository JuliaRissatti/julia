import { Line, Page } from "tesseract.js";
import { MalformedItem } from "../Item/errors";
import { BuyProduct, RawBuyProduct } from "@/app/models/buy-product";

export default function readBuyOrder(orderNumber: string, pages: Array<Page>) {
	// Concatenate all Lines from all Pages
	const lines = pages.reduce((lines: Array<Line>, page) => lines.concat(page.lines), new Array<Line>());

	// Find the order's table beggining
	const buyOrderTableHeader = lines.findIndex((line: Line) => line.text.includes("Pedido/Item"));
	if (buyOrderTableHeader < 0) throw Error("Não foi possível encontrar o início da tabela de pedidos.");

	// Find the order's table ending
	const buyOrderTableFooter = lines.findIndex((line: Line) => line.text.includes("Total Geral"));
	if (buyOrderTableFooter < 0) throw Error("Não foi possível encontrar o fim da tabela de pedidos.");

	const buyOrderTable = lines.slice(buyOrderTableHeader + 1, buyOrderTableFooter);

	const rawProducts = getRawProducts(buyOrderTable);

	return rawProducts.map((rawItemsByProduct) => cookRawProduct(orderNumber, rawItemsByProduct));
}

function getRawProducts(lines: Array<Line>) {
	const rawProducts = new Array<RawBuyProduct>();

	let lastIndex = 0;
	lines.forEach((line: Line, index: number) => {
		if (line.text.includes("Sub-Total")) {
			const data = lines.slice(lastIndex, index + 1);

			const id = data.at(0);
			const items = data.slice(1, -1);
			const subtotal = data.at(-1);

			if (data.length < 3 || !id || !items || !subtotal) {
				throw new MalformedItem("Não foi possível construir o item " + index);
			} else {
				rawProducts.push({
					id,
					items,
					subtotal,
				});

				lastIndex = index + 1;
			}
		}
	});

	return rawProducts;
}

interface KnownItemValues {
	pedido: string;
	perfil: string;
}

function cookRawProduct(orderNumber: string, rawProduct: RawBuyProduct) {
	const knownValues: KnownItemValues = {
		pedido: orderNumber,
		perfil: rawProduct.id.text.split(" ")[0],
	};

	const cookedItems = rawProduct.items.map((line: Line) => {
		const [firstString, secondString] = splitLineInTwo(knownValues, line);

		const [pedido, item, emissao, entrega, cliente, eqtn, perfil, beneficiario] = readFirstString(
			firstString,
			knownValues
		);

		const [liga, tamanho, corte, amarracoes, pecas, liquido, bruto, solicitado, atendido, ca, observacao, etiqueta] =
			readSecondString(secondString);

		return {
			pedido,
			item,
			emissao,
			entrega,
			cliente,
			eqtn,
			perfil,
			beneficiario,
			liga,
			tamanho,
			corte,
			amarracoes,
			pecas,
			liquido,
			bruto,
			solicitado,
			atendido,
			ca,
			observacao,
			etiqueta,
		};
	});

	const subtotal = readSubtotal(knownValues.perfil, rawProduct.subtotal.text);

	return {
		id: knownValues.perfil,
		items: cookedItems,
		subtotal: subtotal,
	};
}

/*
 * A estratégia para obter todos os atributos do item começa por dividir todas as
 * informações da linha em duas partes, as quais podemos delimitar mais seguramente:
 *
 *  Pedido	 Beneficiário   Tamaho       Etiqueta
 * [ - - - - - - - - - - ] [ - - - - - - - - - - ]
 */
function splitLineInTwo(knownValues: KnownItemValues, line: Line) {
	const text = line.text;

	const regexPerfil = new RegExp(`(?<perfil>` + knownValues.perfil + `)`, "g");
	const indexPerfil = regexPerfil.exec(text)?.index;
	if (!indexPerfil) throw new Error();

	const firstBlockStart = 0;
	const firstBlockEnd = indexPerfil + knownValues.perfil.length;
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
function readFirstString(text: string, knownValues: KnownItemValues) {
	text.replaceAll(" ", "");

	if (!text) throw new Error("text");

	const pedidoString = text;
	const pedidoRegExp = new RegExp(`^(?<pedido>` + knownValues.pedido + `)`, "g");
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

	const perfilString = text;
	const perfilRegExp = new RegExp(`(?<perfil>` + knownValues.perfil + `)`, "g");
	const perfilRegExpExec = perfilRegExp.exec(perfilString);
	const perfil = perfilRegExpExec?.at(1);

	if (!perfil) throw new Error("perfil");

	const eqtn = text.substring(perfilRegExpExec!.index - 2, perfilRegExpExec!.index);

	if (!eqtn) throw new Error("eqtn");

	const cliente = entregaString.substring(entregaRegExp?.lastIndex, perfilRegExpExec!.index - eqtn.length);

	if (!cliente) throw new Error("cliente");

	const beneficiario = " ";

	if (!beneficiario) throw new Error("beneficiario");

	return new Array<string>(pedido, item, emissao, entrega, cliente, eqtn, perfil, beneficiario);
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

	return new Array<string>(
		liga,
		tamanho,
		corte,
		amarracoes,
		pecas,
		liquido,
		bruto,
		solicitado,
		atendido,
		ca,
		observacao,
		etiqueta
	);
}

function readSubtotal(perfil: string, subtotalString: string) {
	console.log(subtotalString)
	const [, amarracoes, pecas, liquido, bruto] =
		new RegExp(
			`
		(?<amarracoes>\\s\\d+\\s).*
		(?<pecas>\\s\\d+\\s).*
		(?<liquido>\\b\\d+,\\d{2}).*
		(?<bruto>\\b\\d+,\\d{2})
	`,
			"g"
		).exec(subtotalString) || [];

	return { perfil, amarracoes, pecas, liquido, bruto };
}
