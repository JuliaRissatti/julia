"use client";

import { Line } from "tesseract.js";
import Order from "./order";

/*
Filial Série Nota  Data       T.Saída  Peso (kg)  Valor da Nota  ICM  V.ICMS  V.ICMS-ST  Valor IPI  Valor PIS  V.COFINS  Preço Bruto / Líquido  Condição Pagamento  P.Md.

01212 ACO METAIS FRAIBURGO
00           52876 23/05/2024 00113    942,24     4.400,27       0    0,00    0,00       0,00       72,60      334,42    4,67                   A 07 Pedido: 22947
00           52876 23/05/2024 00126    942,24     4.400,26       0    0,00    0,00       0,00       72,60      334,42    4,67                   A
Sub-Total ACO METAIS FRAIBURGO         1.884,48
*/

export default function Client({ data }: any) {
	const lines: Array<Line> = data;

	if (lines.length < 3) throw new Error("Tem problema no cliente.", { cause: lines });

	const name = lines.at(0)?.text.split(" ").slice(1).join(" ");

	const orders = lines.slice(1, -1).map((line) => line.words.at(-1)?.text);

	return (
		<>
			<div className="bg-blue-800	rounded-md h-7">
				<h1 className="text-lg font-semibold align-middle text-center">{name}</h1>
			</div>
			{orders?.map((order, index) => (
				<Order order={order} key={index} />
			))}
		</>
	);
}
