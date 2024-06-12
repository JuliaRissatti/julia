import { useRef, useState } from "react";

function FileHandler({ label, onFileUpdate }: any) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = (event: any) => onFileUpdate(event.target.files[0]);

	const handleDragOver = (event: any) => {
		// event.preventDefault();
		// setFile(event.target.files);
	};

	const handleDrop = (event: any) => {
		// event.preventDefault();
		// setFile(event.target.files);
	};

	// to do
	const removeFile = (index: number) => {
		// setFile(undefined);
	};

	return (
		<button
			className=" mx-auto p-4 rounded border border-gray-300"
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onClick={() => inputRef?.current?.click()}
		>
			<input type="file" onChange={handleChange} hidden ref={inputRef} />
			{label}
		</button>
	);
}

export default FileHandler;
