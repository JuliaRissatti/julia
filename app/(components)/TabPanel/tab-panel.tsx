"use client";

import { useState } from "react";
import Tab from "./Tab/tab";

function TabPanel({ tabs, contents }: { tabs: any[]; contents: any[] }) {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<>
			<div className="m-2 bg-azure rounded-md">
				<div className="flex bg-lapis-lazulli rounded-t-md pt-2 pl-2">
					{tabs?.map((title: string, index: number) => (
						<Tab key={index} number={index} title={title} activeTab={activeTab} setActive={setActiveTab} />
					))}
				</div>
				{contents?.map((content: string, index: number) => (
					<div key={index} hidden={index !== activeTab} className="">
						{content}
					</div>
				))}
			</div>
		</>
	);
}

export default TabPanel;
