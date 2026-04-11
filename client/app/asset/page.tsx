"use client";

import { useState } from "react";
import { AlertBanner } from "@/components/AlertBanner";
import { NavigationBar } from "@/components/NavigationBar";
import { AssetChart } from "./components/AssetChart";
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
					<AssetChart
						title="6개월 자산 변화"
						data={[
							{ name: "7월", value: 11.8 },
							{ name: "8월", value: 12.1 },
							{ name: "9월", value: 11.5 },
							{ name: "10월", value: 12.3 },
							{ name: "11월", value: 12.6 },
							{ name: "12월", value: 12.8 },
						]}
						config={{
							type: "bar",
							domain: [11, 13.5],
							ticks: [11, 11.5, 12, 12.5, 13],
						}}
					/>
				</>
			);
		case "realestate":
			return (
				<>
					<AssetDetailCard type="property" />
					<AssetDetailCard
						type="property"
						title="경기 성남시 분당구 아파트"
						subtitle="59㎡ (25평)"
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
					<AlertBanner
						message="보험대리청구인으로 지정되셨나요?"
						actionText="인증하기"
						variant="warning"
					/>
					<AssetDetailCard
						type="insurance"
						company="하나생명"
						insuranceName="하나 건강보험"
						monthlyPremium="월 15만원"
						status="needs_check"
					/>
					<AssetDetailCard
						type="insurance"
						company="메리츠화재"
						insuranceName="올바른 암보험"
						monthlyPremium="월 8.5만원"
						status="normal"
					/>
				</>
			);
		case "car":
			return (
				<>
					<AssetDetailCard type="car" />
					<AssetDetailCard
						type="car"
						title="그랜저 IG"
						subtitle="2021년식 · 37,200km"
						value="2,850만원"
						change="15만원"
						changePercent="0.5%"
						isPositive={false}
					/>
				</>
			);
		case "gold":
			return (
				<>
					<AssetDetailCard type="gold" />
					<AssetDetailCard
						type="gold"
						title="KRX 금시장 잔고"
						subtitle="중량: 37.5g"
						value="438만원"
						change="22만원"
						changePercent="10.2%"
						isPositive={true}
					/>
					<AssetChart
						title="국제 금 시세"
						subtitle="최근 6개월 기준"
						data={[
							{ name: "7월", value: 1100 },
							{ name: "8월", value: 1250 },
							{ name: "9월", value: 1150 },
							{ name: "10월", value: 1300 },
							{ name: "11월", value: 1380 },
							{ name: "12월", value: 1400 },
						]}
						config={{
							type: "line",
							color: "#C1B483",
							domain: [0, 1400],
							ticks: [0, 350, 700, 1050, 1400],
						}}
					/>
				</>
			);
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
			<main className="flex flex-col items-center gap-6 px-6 pt-6 pb-25">
				<TabContent activeTab={activeTab} />
			</main>
			<NavigationBar />
		</div>
	);
}
