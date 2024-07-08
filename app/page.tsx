"use client";

import { useEffect, useState } from "react";

import readPNG from "./Services/Tesseract/read-png";
import convertToPNG from "./Services/PDF-Conversion/pdf-to-png";

import { Billing } from "./(components)/Billing/Billing";

import FileHandler from "./(components)/file-handler";
import readBilling from "./(components)/scrappers/billScrapper";
import ClientOrdersView from "./(components)/ClientOrders/ClientOrdersView";

export default function Home() {
	// Arquivo do faturamento em PDF;
	const [billingPDF, setBillingPDF] = useState<File>();
	const [clientsOrders, setClientsOrder] = useState<Array<Billing>>();

	const [fileStatus, setFileStatus] = useState<string | undefined>(undefined);

	const fileName = billingPDF?.name;

	function onFileUpdate(file: File) {
		setBillingPDF(file);
	}

	useEffect(() => {
		if (billingPDF) readBillingPDF(billingPDF);
	}, [billingPDF]);

	async function readBillingPDF(PDF: File) {
		setFileStatus("Convertendo para PNG...");
		const PNGs = await convertToPNG(PDF, false);

		setFileStatus("Extraindo dados...");
		const pages = await readPNG(PNGs);

		setFileStatus("Interpretando");
		const clientsOrders = readBilling(pages);

		setFileStatus(undefined);
		setClientsOrder(clientsOrders);
	}

	return (
		<>
			<div className="grid grid-cols-1 grid-rows-auto grid-flow-row bg-rich-black h-screen items-center">
				<div className={`transition-all ${billingPDF ? "h-min" : "h-max"} duration-300`}>
					<div className="grid grid-rows-1 grid-flow-col justify-center items-center gap-3">
						<p className="font-semibold">Conferência de faturamento</p>
						<FileHandler label="Faturamento" status={fileStatus} onFileUpdate={onFileUpdate} />
					</div>
				</div>

				<div id="canvas" hidden />

				{clientsOrders?.map((clientOrders: Billing, index: number) => (
					<div className="grid grid-cols-7 grid-flow-row auto-rows-min bg-indigo-dye m-5 p-2" key={index}>
						<h1 className="col-span-full text-lg font-semibold text-center">{clientOrders.cliente}</h1>

						<ClientOrdersView clientOrders={clientOrders} />
					</div>
				))}
			</div>
		</>
	);
}
