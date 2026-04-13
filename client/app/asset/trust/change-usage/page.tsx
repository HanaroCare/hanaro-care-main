"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StackedActionFooter from "@/components/StackedActionFooter";
import TrustProgressBar from "../../components/trust/TrustProgressBar";
import TrustStepLayout from "../../components/trust/TrustStepLayout";
import { formatKoreanAmount, parseKoreanAmount } from "../trustUtils";

const items = [
	{ id: "hospital", title: "병원비 자동 집행", amount: "월 43만원" },
	{ id: "living", title: "생활비", amount: "월 100만원" },
];

export default function ChangeUsagePage() {
	const router = useRouter();
	const [selected, setSelected] = useState<Set<string>>(
		new Set(["hospital", "living"]),
	);

	const toggle = (id: string) => {
		setSelected((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const total = items
		.filter((item) => selected.has(item.id))
		.reduce((sum, item) => sum + parseKoreanAmount(item.amount), 0);

	return (
		<TrustStepLayout
			footer={
				<StackedActionFooter
					onConsultClick={() => {
						// 상담 예약 로직
					}}
					onNextClick={() => router.push("/asset/trust/change-agent")}
					nextDisabled={selected.size === 0}
				/>
			}
		>
			<section className="px-6 pt-8">
				<TrustProgressBar step={3} />

				<div className="mt-14">
					<h2 className="text-[22px] leading-[1.45] font-bold tracking-tight text-black">
						신탁 자금을 어디에
						<br />
						사용할까요?
					</h2>
					<p className="mt-4 text-[12px] leading-5 font-normal tracking-snug text-[#6A7282]">
						병원비 계산기 결과가
						<br />
						자동 반영되었어요
					</p>
				</div>

				<div className="mt-10 flex flex-col gap-5">
					{items.map((item) => {
						const isSelected = selected.has(item.id);

						return (
							<button
								key={item.id}
								type="button"
								aria-pressed={isSelected}
								onClick={() => toggle(item.id)}
								className={`flex min-h-25 items-center justify-between rounded-[24px] px-6 py-7 text-left shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition ${
									isSelected
										? "border border-hana-ez-600 bg-[#EFFFFD]"
										: "border border-[#F2F3F5] bg-white"
								}`}
							>
								<p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
									{item.title}
								</p>
								<p
									className={`text-[16px] leading-6 font-medium tracking-tight ${
										isSelected ? "text-hana-ez-600" : "text-[#1F2937]"
									}`}
								>
									{item.amount}
								</p>
							</button>
						);
					})}
				</div>

				{selected.size > 0 && (
					<div className="mt-6 rounded-[20px] bg-[#EFF8F7] px-6 py-7">
						<div className="flex items-center justify-between">
							<span className="text-[16px] leading-6 font-semibold tracking-tight text-hana-ez-600">
								월 집행 합계
							</span>
							<span className="text-[22px] leading-8 font-bold tracking-tight text-hana-ez-600">
								{formatKoreanAmount(total)}
							</span>
						</div>
					</div>
				)}
			</section>
		</TrustStepLayout>
	);
}
