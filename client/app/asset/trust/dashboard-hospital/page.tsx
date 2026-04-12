import PrimaryButton from "@/components/PrimaryButton";
import { AssetDetailCard } from "../../components/trust/AssetDetailCard";
import { AssetSummaryCard } from "../../components/trust/AssetSummaryCard";
import { ExecutionListCard } from "../../components/trust/ExecutionListCard";
import { PortfolioCard } from "../../components/trust/PortfolioCard";

export default function DashboardHospitalPage() {
	return (
		<div className="p-4 space-y-4">
			<AssetSummaryCard />
			<AssetDetailCard />
			<PortfolioCard />
			<ExecutionListCard />
			<PrimaryButton label="설계 변경하기" className="h-14 rounded-2xl" />
		</div>
	);
}
