"use client";

import { useState } from "react";
import Tab from "./Tab/tab";

function TabPanel({ tabs, contents }: { tabs: any[]; contents: any[] }) {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<>
			{tabs?.map((title: string, index: number) => (
				<Tab key={index} number={index} title={title} activeTab={activeTab} setActive={setActiveTab} />
			))}
			{contents?.map((content: string, index: number) => (
				<div key={index} hidden={index !== activeTab}>
					{content}
				</div>
			))}
		</>
	);
}

export default TabPanel;
