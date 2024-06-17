function Tab({
	number,
	title,
	activeTab,
	setActive,
}: {
	number: number;
	title: string;
	activeTab: number;
	setActive: any;
}) {
	const defaultStyle = "border-rich-black border border-b-0 rounded-t-md px-5";
	const unactiveStyle = "bg-slate-500 font-medium";
	const activeStyle = "bg-azure font-semibold";

	console.log(activeTab === number);

	return (
		<>
			<div className="">
				<button
					className={defaultStyle + " " + (activeTab === number ? activeStyle : unactiveStyle)}
					onClick={() => setActive(number)}
				>
					<h1>Pedido nº {title}</h1>
				</button>
			</div>
		</>
	);
}

export default Tab;
