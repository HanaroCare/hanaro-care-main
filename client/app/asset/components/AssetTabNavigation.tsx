"use client";

import { TabNavigation } from "@/components/TabNavigation";
import { useState } from "react";

const TABS = [
	{ id: "asset", label: "자산" },
	{ id: "realestate", label: "부동산" },
	{ id: "insurance", label: "보험" },
	{ id: "car", label: "자동차" },
	{ id: "gold", label: "금" },
];

type AssetTabNavigationProps = {
	initialTab?: string;
	onTabChangeAction?: (tabId: string) => void;
};

export function AssetTabNavigation({
	initialTab = "asset",
	onTabChangeAction,
}: AssetTabNavigationProps) {
	const [activeTab, setActiveTab] = useState(initialTab);

	const handleTabClick = (tabId: string) => {
		setActiveTab(tabId);
		onTabChangeAction?.(tabId);
	};

	return (
		<TabNavigation
			tabs={TABS}
			activeTab={activeTab}
			onTabChange={handleTabClick}
		/>
	);
}
