import InfoBox from "@/components/InfoBox";
import PrimaryButton from "@/components/PrimaryButton";
import { ActionPanelCard } from "../../components/trust/ActionPanelCard";
import { AssetDetailCard } from "../../components/trust/AssetDetailCard";
import { AssetSummaryCard } from "../../components/trust/AssetSummaryCard";
import { PortfolioCard } from "../../components/trust/PortfolioCard";

export default function DashboardLifePage() {
	return (
		<div className="p-4 space-y-4">
			<AssetSummaryCard />
			<AssetDetailCard />
			<ActionPanelCard />
			<PortfolioCard />
			<InfoBox
				title="전문가 코멘트"
				desc="채권 비중을 높여 안정적으로 운용중입니다."
			/>{" "}
			<PrimaryButton label="설계 변경하기" className="h-14 rounded-2xl" />
		</div>
	);
}
