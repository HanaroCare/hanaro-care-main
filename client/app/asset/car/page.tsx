"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { InfoListCard } from "@/components/InfoListCard";
import { AssetChart } from "../components/AssetChart";

export default function CarDetailPage() {
	const router = useRouter();

	return (
		<div className="flex min-h-screen flex-col bg-white">
			<header className="sticky top-0 z-50 flex h-14 items-center px-4 bg-white border-b border-zinc-100">
				<button
					type="button"
					onClick={() => router.back()}
					className="p-2 -ml-2 text-hana-black-900"
				>
					<ChevronLeft size={24} />
				</button>
				<h1 className="flex-1 text-center pr-10 font-semibold text-[17px] text-hana-black-900">
					자동차 상세
				</h1>
			</header>

			<main className="flex flex-col items-center gap-6 px-6 py-6 pb-20">
				<div className="w-full">
					<h2 className="text-[24px] font-bold text-hana-black-900 leading-tight">
						제네시스 GV80
					</h2>
					<p className="mt-1 text-[15px] text-hana-black-500">
						2022년식 · 32,000km
					</p>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-[28px] font-bold text-hana-black-900">
							4,500만원
						</span>
						<span className="text-[15px] font-medium text-hana-blue-500">
							▼ 150만원 (3.2%)
						</span>
					</div>
				</div>

				<AssetChart
					title="중고차 시세 변화"
					subtitle="최근 6개월 기준"
					data={[
						{ name: "7월", value: 4800 },
						{ name: "8월", value: 4750 },
						{ name: "9월", value: 4700 },
						{ name: "10월", value: 4650 },
						{ name: "11월", value: 4600 },
						{ name: "12월", value: 4500 },
					]}
					config={{
						type: "line",
						color: "#008485",
						domain: [4400, 4900],
						ticks: [4400, 4650, 4900],
					}}
				/>

				<InfoListCard
					title="차량 정보"
					items={[
						{ label: "차량번호", value: "123가 4567" },
						{ label: "연식", value: "2022년식" },
						{ label: "주행거리", value: "32,000km" },
						{ label: "연료", value: "가솔린" },
					]}
				/>
			</main>
		</div>
	);
}
