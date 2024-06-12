import { Line } from "tesseract.js";
import { MalformedItem } from "./errors";

function Item({ orderNumber, orderItem, line }: any) {
	const data: Line = line;

	let text: string = data.text;

	
	// Encontrar o número do pedido
	const stringPedido = text;
	console.log("String Pedido: " + stringPedido);

	const regexPedido = new RegExp(`^(?<pedido>\\d+)`, "g");
	const [, pedido] = regexPedido.exec(stringPedido) || [];

	console.log("Pedido:" + pedido);
	if (!pedido || !stringPedido) return;


	// Encontrar o Item, a Data de Emissão e a Data de Entrega
	const stringItemEmissaoEntrega = stringPedido.substring(regexPedido.lastIndex);
	console.log("String Item|Emissão|Entrega: " + stringItemEmissaoEntrega);

	const regexItem = "(?<item>\\d+)";
	const regexEmissao = "(?<emissao>\\d{2}\\/\\d{2}\\/\\d{4})";
	const regexEntrega = "(?<entrega>\\d{2}\\/\\d{2}\\/\\d{4})";
	const regexItemEmissaoEntrega = new RegExp(["s*", regexItem, regexEmissao, regexEntrega].join(".*"), "g");

	const [,item, emissao, entrega] =
		regexItemEmissaoEntrega.exec(text.substring(regexPedido.lastIndex)) || [];

	console.log("Item:" + item);
	console.log("Emissão: " + emissao);
	console.log("Entrega: " + entrega);
	if (!stringItemEmissaoEntrega || !regexItemEmissaoEntrega) return;


	// Encontrar o Cliente e o EqTn
	const stringClienteEqTn = stringItemEmissaoEntrega.substring(regexItemEmissaoEntrega.lastIndex);
	console.log("String Cliente|EqTn: " + stringClienteEqTn);

	const regexCliente = "(?<cliente>\\w+\\s)+";
	const regexEqTn = "(?<EqTn>\\w\\d)";

	const regexClienteEqTn = new RegExp(["s*", regexCliente, regexEqTn].join(""), "g");

	const [, cliente, eqTn] =
		regexClienteEqTn.exec(stringItemEmissaoEntrega.substring(regexItemEmissaoEntrega.lastIndex)) || [];

	console.log("Cliente: " + cliente);
	console.log("EqTn: " + eqTn);
	if (!stringClienteEqTn || !regexClienteEqTn) return;


	const regexPerfil = new RegExp(`^(?<cliente>\\w+\\s)+`, "g");
	const regexBeneficiario = new RegExp(` ".*"      `, "g");
	const regexLiga = new RegExp(` (?<liga>\\d+)`, "g");
	const regexTamanho = new RegExp(`(?<tamanho>T\\d{1})`, "g");
	const regexCorte = new RegExp(`(?<corte>\\d+)`, "g");
	const regexAmr = new RegExp(`(?<amr>\\d+)`, "g");
	const regexPecas = new RegExp(`(?<pecas>\\d+)`, "g");
	const regexLiquido = new RegExp(`(?<liquido>\\d+,\\d{2})`, "g");
	const regexBruto = new RegExp(`(?<bruto>\\d+,\\d{2})`, "g");
	const regexSolicitado = new RegExp(`(?<solicitado>\\d+)`, "g");
	const regexAtendido = new RegExp(`(?<atendido>\\d+)`, "g");
	const regexCa = new RegExp(`(?<ca>\\d+)`, "g");
	const regexObservacao = new RegExp(`(?<ca>\\d+)`, "g");
	const regexEtiqueta = new RegExp(` (?<etiqueta>\\d+)`, "g");

	return <>{line.text}</>;
}

export default Item;
