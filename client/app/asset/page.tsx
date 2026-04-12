"use client";

import { useMemo, useState } from "react";
import { AlertBanner } from "@/components/AlertBanner";
import { NavigationBar } from "@/components/NavigationBar";
import PrimaryButton from "@/components/PrimaryButton";
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
			// TODO: GET /api/asset/real?category=REAL_ESTATE 로 데이터 fetch 후 map으로 렌더링
			return (
				<>
					<AssetDetailCard
						type="property"
						title="서울 강남구 역삼동 아파트"
						subtitle="84㎡ (33평)"
						value="9억 2,000만원"
						change="1,200만원"
						changePercent="10%"
						isPositive={true}
						href="/asset/housing"
					/>
					<AssetDetailCard
						type="property"
						title="경기 성남시 분당구 아파트"
						subtitle="59㎡ (25평)"
						value="5억 1,000만원"
						change="800만원"
						changePercent="5%"
						isPositive={false}
						href="/asset/housing"
					/>
				</>
			);
		case "insurance":
			// TODO: GET /api/asset/financial?category=INSURANCE 로 데이터 fetch 후 map으로 렌더링
			return (
				<div className="flex flex-col items-center gap-6 w-full mt-4">
					<AlertBanner
						message="보험대리청구인으로 지정되셨나요?"
						actionText="인증하기"
						variant="warning"
					/>
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
						iconType="hana-bank"
						company="메리츠화재"
						insuranceName="올바른 암보험"
						monthlyPremium="월 8.5만원"
						status="normal"
					/>
				</div>
			);
		case "car":
			// TODO: GET /api/asset/real?category=VEHICLE 로 데이터 fetch 후 map으로 렌더링
			return (
				<AssetDetailCard
					type="car"
					title="제네시스 GV80"
					subtitle="2022년식 · 32,000km"
					value="4,500만원"
					change="150만원"
					changePercent="3.4%"
					isPositive={false}
					href="/asset/car"
				/>
			);
		case "gold":
			// TODO: GET /api/asset/real?category=GOLD 로 데이터 fetch 후 map으로 렌더링
			return (
				<AssetDetailCard
					type="gold"
					title="골드바 (100g)"
					subtitle="중량: 100g"
					value="1,330만원"
					change="80만원"
					changePercent="10%"
					isPositive={true}
					href="/asset/gold"
				/>
			);
		default:
			return null;
	}
}

export default function AssetPage() {
	const [activeTab, setActiveTab] = useState<TabId>("asset");

	const summaryData = useMemo(
		() => ({
			asset: {
				type: "total" as const,
				amount: "12억 8,540만원",
				buttonLabel: "자산 설계하기",
			},
			realestate: {
				type: "property" as const,
				amount: "14억 3,000만원",
				buttonLabel: "부동산 연동하기",
			},
			insurance: {
				type: "insurance" as const,
				amount: "-",
				buttonLabel: "보험 연동하기",
			},
			car: {
				type: "car" as const,
				amount: "4,500만원",
				buttonLabel: "자동차 연동하기",
			},
			gold: {
				type: "gold" as const,
				amount: "1,330만원",
				buttonLabel: "금 연동하기",
			},
		}),
		[],
	);

	const currentSummary = summaryData[activeTab];

	return (
		<div className="flex min-h-screen flex-col bg-white">
			<div className="sticky top-0 z-50 bg-white">
				<AssetTabNavigation
					initialTab={activeTab}
					onTabChangeAction={(tabId) => setActiveTab(tabId as TabId)}
				/>
				{/* TODO: GET /api/asset 로 totalAmount fetch */}
				<AssetSummaryHeader
					type={currentSummary.type}
					amount={currentSummary.amount}
				/>
			</div>
			<main className="flex flex-col items-center gap-6 px-6 pb-10">
				<TabContent activeTab={activeTab} />

				<div className="w-full mt-4 mb-20">
					<PrimaryButton
						label={currentSummary.buttonLabel}
						onClick={() => console.log(`${currentSummary.buttonLabel} 클릭`)}
					/>
				</div>
			</main>
			<NavigationBar />
		</div>
	);
}
