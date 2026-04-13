"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PrimaryButton from "@/components/baseelements/PrimaryButton";
import TrustStepLayout from "../../components/trust/TrustStepLayout";

export default function ChangeLivingLimitPage() {
	const router = useRouter();
	const [amount, setAmount] = useState(100);

	return (
		<TrustStepLayout
			footer={
				<footer className="shrink-0 bg-white px-6 py-4">
					<PrimaryButton
						label="상담 예약하기"
						className="h-14 rounded-2xl text-[16px] leading-6"
						onClick={() => router.back()}
					/>
				</footer>
			}
		>
			<section className="px-6 pt-8">
				<div className="mt-10">
					<h2 className="text-[22px] leading-[1.45] font-bold tracking-tight text-black">
						생활비 한도를
						<br />
						변경할까요?
					</h2>
					<p className="mt-4 text-[12px] leading-5 font-normal tracking-snug text-[#6A7282]">
						월 단위 생활비 집행 한도를 설정할 수 있어요
					</p>
				</div>

				<div className="mt-10 rounded-[24px] border border-[#F2F3F5] bg-white px-6 py-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
					<p className="text-[14px] leading-5 font-medium text-[#6A7282]">
						현재 생활비 한도
					</p>
					<p className="mt-3 text-[28px] leading-9 font-bold tracking-tight text-hana-ez-600">
						월 {amount}만원
					</p>

					<input
						aria-label="생활비 한도"
						aria-valuetext={`월 ${amount}만원`}
						type="range"
						min={50}
						max={300}
						step={10}
						value={amount}
						onChange={(e) => setAmount(Number(e.target.value))}
						className="mt-8 w-full accent-[#00A8A6]"
					/>

					<div className="mt-3 flex justify-between text-[12px] text-[#9CA3AF]">
						<span>50만원</span>
						<span>300만원</span>
					</div>
				</div>
			</section>
		</TrustStepLayout>
	);
}
