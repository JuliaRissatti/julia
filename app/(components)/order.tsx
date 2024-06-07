"use client";

import { SetStateAction, useState } from "react";

import PdfInput from "./pdf-input";
import PdfToPng from "./pdf-to-png";
import OrderItems from "./orderItems";

export default function Order( {order}: any ) {
	const [PDF, setPDF] = useState<File>();
	const [PNGs, setPNGs] = useState<Array<string>>();

	const handlePDFOutput = (data: SetStateAction<File | undefined>) => {
		setPDF(data);
	};

	const handlePNGsOutput = (data: SetStateAction<Array<string> | undefined>) => {
		setPNGs(data);
	};

    const label = "Pedido nº " + order;

	return (
		<div className="p-3">
			<PdfInput label={label} onChildDataUpdate={handlePDFOutput} />

			<PdfToPng PDF={PDF} onChildDataUpdate={handlePNGsOutput} />

			<OrderItems PNGs={PNGs} />
		</div>
	);
}
