"use client";

import { Suspense, useRef, useState } from "react";

export default function InputPDF({ handlePDFChange }: any) {
	const [file, setFile] = useState<File>();

	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = (event: any) => {
		handlePDFChange(event.target.files[0]);
		setFile(event.target.files[0]);
	};

	const handleDragOver = (event: any) => {
		event.preventDefault();
		setFile(event.target.files);
	};

	const handleDrop = (event: any) => {
		event.preventDefault();
		setFile(event.target.files);
	};

	const removeFile = (index: number) => {
		setFile(undefined);
	};

	return (
		<div>
			<button
				className="w-4/5 mx-auto p-4 rounded border border-gray-300"
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				onClick={() => inputRef?.current?.click()}
			>
				<input type="file" onChange={handleChange} hidden ref={inputRef} />
				<h1>Input PDF</h1>
			</button>
		</div>
	);
}
