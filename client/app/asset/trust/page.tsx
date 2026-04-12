"use client";

import { CircleCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DualActionFooter from "@/components/button/DualActionFooter";

const benefits = [
	{
		title: "병원비 걱정 없어요",
		desc: "치매가 와도 병원비, 요양비가 자동으로 지급돼요",
	},
	{
		title: "전문가가 대신 굴려줘요",
		desc: "내 돈이 잠자지 않아요",
	},
	{
		title: "자녀에게 원하는 대로 남겨요",
		desc: "내가 정한대로 상속돼요",
	},
];

export default function TrustPage() {
	const router = useRouter();
	return (
		<div className="app-shell">
			<div className="app-layout">
				<main className="app-main no-scrollbar">
					<section className="px-6.25 pt-6">
						<p className="mb-1 text-[12px] leading-4.5 font-normal text-[#6A7282]">
							내맘대로신탁
						</p>

						<h1 className="m-0 text-[28px] leading-10.5 font-bold text-[#101828]">
							치매가 와도
							<br />내 돈은 내뜻대로
						</h1>

						<div className="mt-2 flex justify-center">
							<Image
								src="/images/trust.png"
								alt="가족 일러스트"
								width={240}
								height={226}
								className="h-56.5 w-60 object-contain"
								priority
							/>
						</div>
					</section>

					<section className="px-6.25 pt-5 pb-6">
						<h2 className="ml-1.5 mb-3 text-[16px] leading-6 font-medium tracking-[-0.64px] text-black">
							이런 점이 좋아요
						</h2>

						<div className="flex flex-col gap-7 rounded-4xl bg-hana-silver-50 px-6.75 py-6.25">
							{benefits.map((benefit) => (
								<div key={benefit.title} className="flex items-start gap-2.25">
									<div className="mt-0.5 shrink-0">
										<CircleCheck size={20} className="text-[#4A5565]" />
									</div>

									<div className="flex flex-col gap-0.5">
										<p className="m-0 text-[16px] leading-5.5 font-medium tracking-[-0.04em] text-hana-black-800">
											{benefit.title}
										</p>
										<p className="m-0 text-[12px] leading-4.5 font-normal tracking-[-0.04em] text-hana-black-800">
											{benefit.desc}
										</p>
									</div>
								</div>
							))}
						</div>
					</section>
				</main>

				<DualActionFooter
					leftLabel="상담 신청"
					rightLabel="상품 비교"
					onRightClick={() => router.push("/asset/trust/select-assets")}
				/>
			</div>
		</div>
	);
}
