"use client";

import { useState } from "react";
import { NavigationBar } from "@/components/NavigationBar";
import { AssetChangeChart } from "./components/AssetChangeChart";
import { AssetDetailCard } from "./components/AssetDetailCard";
import { AssetListCard } from "./components/AssetListCard";
import { AssetSummaryHeader } from "./components/AssetSummaryHeader";
import { AssetTabNavigation } from "./components/AssetTabNavigation";

type TabId = "asset" | "realestate" | "insurance" | "car" | "gold";

function TabContent({ activeTab }: { activeTab: TabId }) {
	switch (activeTab) {
		case "asset":
			return (
				<>
					<AssetListCard />
					<AssetChangeChart />
				</>
			);
		case "realestate":
			return (
				<>
					<AssetDetailCard type="property" />
					<AssetDetailCard
						type="property"
						address="경기 성남시 분당구 아파트"
						details="59㎡ (25평)"
						value="5억 1,000만원"
						change="800만원"
						changePercent="5%"
						isPositive={false}
					/>
				</>
			);
		case "insurance":
			return (
				<>
					<AssetDetailCard
						type="insurance"
						iconType="hana-bank"
						company="하나생명"
						insuranceName="하나 건강보험"
						monthlyPremium="월 15만원"
						status="needs_check"
					/>
					<AssetDetailCard
						type="insurance"
						iconType="nation-pension"
						company="메리츠화재"
						insuranceName="올바른 암보험"
						monthlyPremium="월 8.5만원"
						status="normal"
					/>
				</>
			);
		case "car":
			return <div>자동차 컴포넌트 준비 중</div>;
		case "gold":
			return <div>금 컴포넌트 준비 중</div>;
		default:
			return null;
	}
}

export default function AssetPage() {
	const [activeTab, setActiveTab] = useState<TabId>("asset");

	return (
		<div className="flex min-h-screen flex-col bg-zinc-50">
			<div className="sticky top-0 z-50 bg-white">
				<AssetTabNavigation
					initialTab={activeTab}
					onTabChangeAction={(tabId) => setActiveTab(tabId as TabId)}
				/>
				<AssetSummaryHeader totalAmount="10억 3,700만원" />
			</div>
			<main className="flex flex-col items-center gap-6 px-6 pt-6 pb-[100px]">
				<TabContent activeTab={activeTab} />
			</main>
			<NavigationBar />
		</div>
	);
}
