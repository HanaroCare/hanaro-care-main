"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import TrustProgressBar from "../../components/trust/TrustProgressBar";
import TrustStepLayout from "../../components/trust/TrustStepLayout";
import { formatKoreanAmount, parseKoreanAmount } from "../trustUtils";

const assets = [
	{ id: "cash", title: "현금 / 예금", amount: "8,000만원" },
	{ id: "insurance", title: "보험 해지환급금", amount: "약 4,200만원" },
	{ id: "realestate", title: "부동산", amount: "10억원" },
];

export default function TrustAssetSelectPage() {
	const router = useRouter();
	const [selected, setSelected] = useState<Set<string>>(new Set());

	const toggle = (id: string) => {
		setSelected((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const total = assets
		.filter((a) => selected.has(a.id))
		.reduce((sum, a) => sum + parseKoreanAmount(a.amount), 0);

	return (
		<TrustStepLayout
			footer={
				<footer className="bg-white px-6 pb-8 pt-10">
					<PrimaryButton
						label="연결하기"
						disabled={selected.size === 0}
						onClick={() => router.push("/asset/trust/start-timing")}
					/>
				</footer>
			}
		>
			<section className="px-6 pt-8">
				<TrustProgressBar step={1} />

				<div className="mt-14">
					<p className="text-[22px] font-bold leading-[1.45] tracking-[-0.02em] text-black">
						<span className="text-hana-ez-600">맡길 자산</span>을
						<br />
						선택해주세요
					</p>
					<p className="mt-3 text-[12px] text-[#6A7282]">
						마이데이터로 자동 조회했어요
					</p>
				</div>

				<div className="mt-6 flex flex-col gap-4">
					{assets.map((asset) => {
						const isSelected = selected.has(asset.id);
						return (
							<button
								key={asset.id}
								type="button"
								onClick={() => toggle(asset.id)}
								aria-pressed={isSelected}
								className={`w-full rounded-[24px] px-6 py-7 text-left shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition ${
									isSelected
										? "border border-hana-ez-600 bg-[#EFFFFD]"
										: "border border-[#F2F3F5] bg-white"
								}`}
							>
								<div className="flex items-center justify-between">
									<p className="text-[16px] font-semibold text-[#1F2937]">
										{asset.title}
									</p>
									<p
										className={`text-[16px] font-medium ${
											isSelected ? "text-hana-ez-600" : "text-[#1F2937]"
										}`}
									>
										{asset.amount}
									</p>
								</div>
							</button>
						);
					})}
				</div>

				{selected.size > 0 && (
					<div className="mt-18 rounded-[24px] bg-[#EFF8F7] px-6 py-8">
						<div className="flex justify-between">
							<span className="text-[16px] font-semibold text-hana-ez-600">
								선택 합계
							</span>
							<span className="text-[22px] font-bold text-hana-ez-600">
								{formatKoreanAmount(total)}
							</span>
						</div>
					</div>
				)}
			</section>
		</TrustStepLayout>
	);
}
