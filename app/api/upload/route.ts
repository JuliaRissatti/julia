import { NextRequest, NextResponse } from "next/server";
import PDFParser, { Output } from "pdf2json";
// https://github.com/modesty/pdf2json/issues/273

export async function POST(request: NextRequest) {
	const formData = await request.formData();

	const file: File | null = formData.get("file") as File;

	const arrayBuffer = await file.arrayBuffer();

	const buffer = Buffer.from(arrayBuffer);

	const pdfParser = new PDFParser();
	// const pdfParser = new PDFParser(undefined, undefined, "089591");

	return new Promise((resolve, reject) => {
		pdfParser.on("pdfParser_dataError", (error: any) => {
			const reason = NextResponse.json({ error: error }, { status: 500 });
			reject(reason);
		});

		pdfParser.on("pdfParser_dataReady", (pdfData: Output) => {
			const data = pdfData;
			const value = NextResponse.json({ data: data }, { status: 201 });
			resolve(value);
		});

		pdfParser.parseBuffer(buffer);
	})
		.then((value) => {
			return value;
		})
		.catch((error) => {
			return error;
		});
}
