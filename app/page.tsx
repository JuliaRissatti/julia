"use client";

import { useEffect, useState } from "react";

import readPNG from "./Services/Tesseract/read-png";
import convertToPNG from "./Services/PDF-Conversion/pdf-to-png";

import { Billing } from "./(components)/Billing/Model/Billing";

import FileHandler from "./(components)/file-handler";
import readBilling from "./(components)/scrappers/billScrapper";
import BillingView from "./(components)/Billing/View/BillingView/BillingView";

function Home() {
	// Arquivo do faturamento em PDF;
	const [billingPDF, setBillingPDF] = useState<File>();
	const [billings, setBillings] = useState<Array<Billing>>();

	const [status, setStatus] = useState<string | undefined>(undefined);

	const fileName = billingPDF?.name;

	function onFileUpdate(file: File) {
		setBillingPDF(file);
	}

	useEffect(() => {
		if (billingPDF) readBillingPDF(billingPDF);
	}, [billingPDF]);

	async function readBillingPDF(PDF: File) {
		setStatus("Convertendo para PNG...");
		const PNGs = await convertToPNG(PDF, false);

		setStatus("Extraindo dados...");
		const pages = await readPNG(PNGs);

		setStatus("Interpretando");
		const ordersByClient = readBilling(pages);

		setStatus(undefined);
		setBillings(ordersByClient);
	}

	return (
		<>
			<div className="grid grid-cols-1 grid-rows-auto grid-flow-row bg-rich-black h-screen items-center">
				<div className={`transition-all ${billingPDF ? "h-min" : "h-max"} duration-300`}>
					<div className="grid grid-rows-1 grid-flow-col justify-center items-center gap-3">
						<p className="font-semibold">Conferência de faturamento</p>
						<FileHandler label="Faturamento" status={status} onFileUpdate={onFileUpdate} />
					</div>
				</div>

				<div id="canvas" hidden />

				{billings?.map((billing: Billing, index: number) => (
					<BillingView key={index} billing={billing} />
				))}
			</div>
		</>
	);
}

export default Home;
