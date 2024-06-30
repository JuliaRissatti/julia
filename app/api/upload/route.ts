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

	return new Promise<Response>((resolve, reject) => {
		pdfParser.on("pdfParser_dataError", (error: Record<"parserError", Error>) => {
			const reason = NextResponse.json({ error }, { status: 500 });
			reject(reason);
		});

		pdfParser.on("pdfParser_dataReady", (data: Output) => {			
			const response = NextResponse.json({ data }, { status: 500 });
			resolve(response)
		});

		pdfParser.parseBuffer(buffer);
	}).finally()
}
