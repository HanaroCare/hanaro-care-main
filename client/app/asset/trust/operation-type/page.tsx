"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TrustChoiceStep from "../../components/trust/TrustChoiceStep";
import TrustNextButton from "../../components/trust/TrustNextButton";
import TrustProgressBar from "../../components/trust/TrustProgressBar";
import TrustStepLayout from "../../components/trust/TrustStepLayout";

const options = [
	{
		id: "managed",
		emoji: "🧑‍💼",
		title: "일임형",
		highlight: "연평균 3.5~5%",
		desc: "전문가가 운용",
		recommended: true,
	},
	{
		id: "self",
		emoji: "🧑‍💼",
		title: "직접 운용",
		highlight: "운용 방식에 따라 다름",
		desc: "내가 원하는대로 운용",
	},
];

export default function OperationTypePage() {
	const router = useRouter();
	const [selected, setSelected] = useState<string | null>("managed");

	return (
		<TrustStepLayout
			footer={
				<footer className="shrink-0 bg-white px-6 pb-8 pt-10">
					<TrustNextButton
						disabled={!selected}
						onClick={() => router.push("/asset/trust/payout-type")}
					/>
				</footer>
			}
		>
			<section className="px-6 pt-8">
				<TrustProgressBar step={3} />

				<TrustChoiceStep
					question={
						<>
							어떤 형태로
							<br />
							자산을 굴릴까요?
						</>
					}
					options={options}
					selected={selected}
					onSelect={setSelected}
					infoBox={{
						title: "일임형이란?",
						desc: "전문가가 채권, 주식, 펀드를 나눠서 자산을 운용해줍니다. 매 분기 결과를 앱에서 확인할 수 있습니다.",
					}}
				/>
			</section>
		</TrustStepLayout>
	);
}
