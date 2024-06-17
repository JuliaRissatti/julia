import { useRef } from "react";
import Image from "next/image";

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
		<>
			<button
				className="transition ease-in-out hover:scale-110 hover:bg-oxford-blue duration-300"
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				onClick={() => inputRef?.current?.click()}
			>
				<div className="rounded border border-lapis-lazulli p-3">
					<div className="flex justify-between">
						<div className="relative size-14">
							<Image className="object-contain" fill src="https://www.svgrepo.com/show/66745/pdf.svg" alt="" />
						</div>
						<div className="flex items-center">
							<p className="align-middle">faça o upload de um faturamento</p>
						</div>
					</div>{" "}
				</div>
				<input type="file" onChange={handleChange} hidden ref={inputRef} />
			</button>
		</>
	);
}

export default FileHandler;
