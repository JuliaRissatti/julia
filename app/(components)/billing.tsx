"use client";

import { SetStateAction, useState } from "react";

import PdfInput from "./pdf-input";
import PdfToPng from "./pdf-to-png";
import Clients from "./clients";

export default function Billing() {
	const [PDF, setPDF] = useState<File>();
	const [PNGs, setPNGs] = useState<Array<string>>();

	const handlePDFOutput = (data: SetStateAction<File | undefined>) => {
		setPDF(data);
	};

	const handlePNGsOutput = (data: SetStateAction<Array<string> | undefined>) => {
		setPNGs(data);
	};

	return (
		<div>
			<PdfInput onChildDataUpdate={handlePDFOutput} />

			<PdfToPng PDF={PDF} onChildDataUpdate={handlePNGsOutput} />

			<Clients PNGs={PNGs} />
		</div>
	);
}
