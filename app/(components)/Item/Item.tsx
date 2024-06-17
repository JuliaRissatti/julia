import { Line } from "tesseract.js";
import { MalformedItem } from "./errors";

function Item({ orderNumber, orderItem, line }: any) {
	const data: Line = line;

	let text: string = data.text;

	// Número do Pedido - P
	const stringP = text.substring(0, undefined);
	const regexP = new RegExp(`^(?<pedido>` + orderNumber + `)`, "g");
	const [, pedido] = regexP.exec(stringP) || [];

	if (!regexP || !stringP) return;

	// Item|Data de Emissão|Data de Entrega - IEE
	const stringIEE = stringP.substring(regexP.lastIndex);
	const regexItem = `(?<item>\\d+)`;
	const regexEmissao = `(?<emissao>\\d{2}\\/\\d{2}\\/\\d{4})`;
	const regexEntrega = `(?<entrega>\\d{2}\\/\\d{2}\\/\\d{4})`;
	const regexIEE = new RegExp(["\\s*", regexItem, regexEmissao, regexEntrega].join(".*"), "g");
	const [, item, emissao, entrega] = regexIEE.exec(stringIEE) || [];

	if (!stringIEE || !regexIEE) return;

	// Cliente|EqTn - CE
	const stringCE = stringIEE.substring(regexIEE.lastIndex);
	const regexCliente = `(?<cliente>\\w+\\s)+`;
	const regexEqTn = `(?<EqTn>\\w\\d)`;
	const regexCE = new RegExp(["", regexCliente, regexEqTn].join("\\s*"), "g");
	const [, cliente, eqTn] = regexCE.exec(stringCE) || [];

	console.log(stringCE);
	console.log(regexCE);

	if (!stringCE || !regexCE) return;

	// Perfil|Beneficiário|Liga|Tamanho - PBLT
	const stringPBLT = stringCE.substring(regexCE.lastIndex);
	const regexPerfil = `(?<perfil>` + orderItem + `)`;
	const regexBeneficiario = ``;
	const regexLiga = `(?<liga>\\d+)`;
	const regexTamanho = `(?<tamanho>T\\d{1})`;
	const regexPBLT = new RegExp(["", regexPerfil, regexBeneficiario, regexLiga, regexTamanho].join("\\s*"), "g");
	const [, perfil, liga, tamanho] = regexPBLT.exec(stringPBLT) || [];

	if (!stringPBLT || !regexPBLT) return;

	// Corte|Amr|Peças|Líquido|Bruto|Solicitado|Atendido|CA - CAPLBSAC
	const stringCAPLBSAC = stringPBLT.substring(regexPBLT.lastIndex);
	const regexCorte = `(?<corte>\\d+)`;
	const regexAmr = `(?<amr>\\d+)`;
	const regexPecas = `(?<pecas>\\d+)`;
	const regexLiquido = `(?<liquido>\\d+,\\d{2})`;
	const regexBruto = `(?<bruto>\\d+,\\d{2})`;
	const regexSolicitado = `(?<solicitado>\\d+)`;
	const regexAtendido = `(?<atendido>\\w+)`;
	const regexCa = `(?<ca>\\w)`;
	const regexCAPLBSAC = new RegExp(
		["", regexCorte, regexAmr, regexPecas, regexLiquido, regexBruto, regexSolicitado, regexAtendido, regexCa].join(
			"\\s+"
		),
		"g"
	);
	const [, corte, amr, pecas, liquido, bruto, solicitado, atendido, ca] = regexCAPLBSAC.exec(stringCAPLBSAC) || [];

	if (!stringCAPLBSAC || !regexCAPLBSAC) return;

	// Observação|Etiqueta| - OE
	const stringOE = stringCAPLBSAC.substring(regexCAPLBSAC.lastIndex);
	const regexObservacao = `(?<observacao>[\\-]?\\d+,\\d{2}%)`;
	const regexEtiqueta = `(?<etiqueta>\\b\\d+)`;
	const regexOE = new RegExp(["", regexObservacao, regexEtiqueta].join(".*"), "g");
	const [, observacao, etiqueta] = regexOE.exec(stringOE) || [];

	return (
		<>
			<tr>
				<td hidden className="border border-slate-600 p-3">
					{pedido}
				</td>
				<td hidden className="border border-slate-600 p-3">
					{item}
				</td>
				<td className="border border-slate-600 p-3">{emissao}</td>
				<td className="border border-slate-600 p-3">{entrega}</td>
				<td hidden className="border border-slate-600 p-3">
					{cliente}
				</td>
				<td hidden className="border border-slate-600 p-3">
					{eqTn}
				</td>
				<td hidden className="border border-slate-600 p-3">
					{perfil}
				</td>
				<td hidden className="border border-slate-600 p-3">
					beneficiario
				</td>
				<td className="border border-slate-600 p-3">{liga}</td>
				<td className="border border-slate-600 p-3">{tamanho}</td>
				<td className="border border-slate-600 p-3">{corte}</td>
				<td className="border border-slate-600 p-3">{amr}</td>
				<td className="border border-slate-600 p-3">{pecas}</td>
				<td className="border border-slate-600 p-3">{liquido}</td>
				<td className="border border-slate-600 p-3">{bruto}</td>
				<td className="border border-slate-600 p-3">{solicitado}</td>
				<td hidden className="border border-slate-600 p-3">
					{atendido}
				</td>
				<td hidden className="border border-slate-600 p-3">
					{ca}
				</td>
				<td className="border border-slate-600 p-3">{observacao}</td>
				<td className="border border-slate-600 p-3">{etiqueta}</td>
			</tr>
		</>
	);
}

export default Item;
