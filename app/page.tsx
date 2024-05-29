"use client";

import { SetStateAction, useState } from "react";

import InputPDF from "./(components)/PDF/inputPDF";
import DisplayTheGold from "./(components)/PDFtoPNG";

export default function Home() {
	const [pdf, setPDF] = useState<File>();
	const [png, setPNG] = useState<Array<String>>();

	const handlePDFChange = (file: SetStateAction<File | undefined>) => {
		setPDF(file);
	};

	return (
		<div className="absolute text-center text-stone-50 inset-0 -z-10 h-full w-full px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
			<InputPDF handlePDFChange={handlePDFChange} />
			{pdf && <DisplayTheGold pdf={pdf}></DisplayTheGold>}
		</div>
	);
}
