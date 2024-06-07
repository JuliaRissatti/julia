// https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html

import { useEffect, useState } from "react";
import { ImageLike, createWorker } from "tesseract.js";
import Faturamento from "./billing";

export default function PNGtoText({ PNGs, onChildDataUpdate }: any) {
	useEffect(() => {
		console.log("Trabalhando...");
		createWorker("por").then((worker) => {
			PNGs?.map((PNG: ImageLike) => {
				let data;

				worker.recognize(PNG).then((results) => {
					data = results.data;
				});

				return data;
			});

			onChildDataUpdate(PNGs);
		});
	}, [PNGs]);

	return <p></p>;
}
