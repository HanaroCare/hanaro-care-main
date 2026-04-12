"use client";

import { NavigationBar } from "@/components/NavigationBar";
import { AssetDashboard } from "./asset/components/AssetDashboard";
import { MedicalBudgetCard } from "./asset/components/MedicalBudgetCard";
import { BannerCard } from "./asset/components/notification/BannerCard";
import { InheritanceStepCard } from "./asset/components/notification/InheritanceStepCard";
import { LivingExpenseCard } from "./asset/components/notification/LivingExpenseCard";
import { MedicalBillCard } from "./asset/components/notification/MedicalBillCard";
import { PensionCard } from "./asset/components/notification/PensionCard";
import { RealAssetCard } from "./asset/components/RealAssetListCard";

export default function Home() {
	return (
		<main className="flex flex-col items-center gap-6 px-6 pt-6 pb-25">
			<AssetDashboard />

			<BannerCard
				title={<>내 남은 인생,{"\n"}평생 병원비 걱정 없을까요?</>}
				buttonText="병원비 계산하기"
				imageSrc="/images/asset/medical.svg"
				onClick={() => console.log("병원비 계산")}
			/>

			<BannerCard
				title={<>미리 준비하는 상속{"\n"}가족 모두가 든든해져요</>}
				buttonText="상속 계산하기"
				imageSrc="/images/asset/inheritance-recom.svg"
				onClick={() => console.log("상속 계산")}
			/>

			<MedicalBudgetCard />

			<InheritanceStepCard />

			<BannerCard
				title={
					<>
						남노인 손님,{"\n"}
						병원비 부담이 <span className="text-hana-red-500">30%</span>{" "}
						줄었네요
					</>
				}
				buttonText="확인하러 가기"
				imageSrc="/images/asset/asset-big-change.svg"
				onClick={() => console.log("자산 변동 확인")}
			/>

			<BannerCard
				title={<>내 집에 살면서{"\n"}매달 안정적인 생활비를 받아보세요</>}
				buttonText="확인하러 가기"
				imageSrc="/images/asset/housing-pension.svg"
				onClick={() => console.log("주택연금 확인")}
			/>

			<RealAssetCard />
			<MedicalBillCard />
			<PensionCard />
			<LivingExpenseCard />
			<NavigationBar />
		</main>
	);
}
