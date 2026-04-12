"use client";

import Image from "next/image";
import { NotificationButton } from "./NotificationButton";
import { NotificationCardWrapper } from "./NotificationCardWrapper";

type LivingExpenseCardProps = {
	overAmount?: number;
	onClick?: () => void;
};

export function LivingExpenseCard({
	overAmount = 800000,
	onClick,
}: LivingExpenseCardProps) {
	return (
		<NotificationCardWrapper
			gradientColor="#F04452"
			shadowColor="rgba(240,68,82,0.08)"
		>
			<h2 className="whitespace-pre-line text-center font-bold text-[19px] text-hana-black-800 leading-6.5">
				이번달 생활비 예산보다{"\n"}
				<span className="text-hana-red-500">
					{(overAmount / 10000).toLocaleString()}만원
				</span>
				을 더 사용했어요
			</h2>

			<div className="mt-6 mb-4">
				<Image
					src="/images/asset/payment.svg"
					alt=""
					width={133}
					height={133}
					aria-hidden="true"
					priority
				/>
			</div>

			<div className="mt-4 w-full">
				<NotificationButton variant="red" onClick={onClick}>
					자산 현황 보러가기
				</NotificationButton>
			</div>
		</NotificationCardWrapper>
	);
}
