import { Line, Page } from "tesseract.js";

export default function getOrdersByClient(pages: Array<Page>) {
	// Concatenate all Lines from all Pages
	const lines = pages.reduce((lines: Array<Line>, page) => lines.concat(page.lines), new Array<Line>());

	// Find the order's table beggining
	const clientsOrdersHeader = lines.findIndex((line: Line) => line.text.includes("Filial Série Nota Data"));
	if (!clientsOrdersHeader) throw Error("Não foi possível encontrar o início da tabela de pedidos.");

	// Find the order's table ending
	const clientsOrdersFooter = lines.findIndex((line: Line) => line.text.includes("Total Geral"));
	if (!clientsOrdersFooter) throw Error("Não foi possível encontrar o fim da tabela de pedidos.");

	// Slice content between beggining and ending
	const clientsOrdersLines = lines.slice(clientsOrdersHeader + 1, clientsOrdersFooter);

	//
	const ordersByClient = new Array<Array<Line>>();

	let lastIndex = 0;
	clientsOrdersLines.forEach((line: Line, index: number) => {
		if (line.text.includes("Sub-Total")) {
			ordersByClient.push(clientsOrdersLines.slice(lastIndex, index + 1));
			lastIndex = index + 1;
		}
	});

	return ordersByClient;
}
