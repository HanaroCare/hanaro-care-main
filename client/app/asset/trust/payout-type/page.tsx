"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TrustChoiceStep from "../../components/trust/TrustChoiceStep";
import TrustNextButton from "../../components/trust/TrustNextButton";
import TrustProgressBar from "../../components/trust/TrustProgressBar";
import TrustStepLayout from "../../components/trust/TrustStepLayout";

const options = [
	{
		id: "free",
		emoji: "🧑‍💼",
		title: "자유형",
		desc: "원할때 받기",
	},
	{
		id: "pension",
		emoji: "🧑‍💼",
		title: "연금형",
		desc: "연금 형태로 받기",
	},
];

export default function PayoutTypePage() {
	const router = useRouter();
	const [selected, setSelected] = useState<string | null>("free");

	return (
		<TrustStepLayout
			footer={
				<footer className="shrink-0 bg-white px-6 pb-8 pt-10">
					<TrustNextButton
						disabled={!selected}
						onClick={() => router.push("/asset/trust/payout-use")}
					/>
				</footer>
			}
		>
			<section className="px-6 pt-8">
				<TrustProgressBar step={4} />

				<TrustChoiceStep
					question={
						<>
							어떤 형태로
							<br />
							자산을 받을까요?
						</>
					}
					options={options}
					selected={selected}
					onSelect={setSelected}
				/>
			</section>
		</TrustStepLayout>
	);
}
