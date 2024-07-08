import { Line, Page } from "tesseract.js";

import { RawBilling, Billing } from "../Billing/Billing";
import { Orders } from "../Order/Orders";

export default function readBilling(pages: Array<Page>) {
	// Concatenate all Lines from all Pages
	const lines = pages.reduce((lines: Array<Line>, page) => lines.concat(page.lines), new Array<Line>());

	// Find the order's table beggining
	const clientsBillingHeader = lines.findIndex((line: Line) => line.text.includes("Filial Série Nota Data"));
	if (!clientsBillingHeader) throw Error("Não foi possível encontrar o início da tabela de pedidos.");

	// Find the order's table ending
	const clientsBillingFooter = lines.findIndex((line: Line) => line.text.includes("Total Geral"));
	if (!clientsBillingFooter) throw Error("Não foi possível encontrar o fim da tabela de pedidos.");

	// Slice content between beggining and ending
	const clientsBillingTable = lines.slice(clientsBillingHeader + 1, clientsBillingFooter);

	const clientsBillingLines: Array<Array<Line>> = extractClientsBillingsLines(clientsBillingTable);

	const clientsBillingString: Array<RawBilling> = clientsBillingLines.map((billing) => convertToString(billing));

	const clientsBilling: Array<Billing> = clientsBillingString.map((billing) => convertToBilling(billing));

	return clientsBilling;
}

function extractClientsBillingsLines(clientsBillingTable: Array<Line>) {
	const clientsBillingLines = new Array<Array<Line>>();

	let lastIndex = 0;
	clientsBillingTable.forEach((line: Line, index: number) => {
		if (line.text.includes("Sub-Total")) {
			clientsBillingLines.push(clientsBillingTable.slice(lastIndex, index + 1));
			lastIndex = index + 1;
		}
	});

	return clientsBillingLines;
}

function convertToString(billing: Array<Line>) {
	if (billing.length < 3) throw new Error("Não rolou o faturamento do cliente");

	const header = billing.at(0);
	const orders = billing.slice(1, -1);
	const subtotal = billing.at(-1);

	if (!header || !orders || !subtotal) throw new Error("Não rolou montar as linhas do produto ae");

	return { header, orders, subtotal };
}

function convertToBilling(rawBilling: RawBilling): Billing {
	const { filial, cliente } = readHeader(rawBilling.header);

	const pedidos: Array<Orders> = rawBilling.orders.map((rawOrder) => readOrder(rawOrder));

	const subtotal = rawBilling.subtotal;

	return { filial, cliente, pedidos, subtotal };
}

function readHeader(line: Line) {
	const [filial, ...clienteSplitted] = line.text.trim().split(" ");
	const cliente = clienteSplitted.join(" ");

	return { filial, cliente };
}

function readOrder(orderLine: Line) {
	const orderString = orderLine.words.at(-1)?.text;
	const number = Number(orderString);

	return { number };
}
