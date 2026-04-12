"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { NotificationButton } from "./NotificationButton";
import { NotificationCardWrapper } from "./NotificationCardWrapper";

type MedicalBillCardProps = {
	usedAmount?: number;
	totalLimit?: number;
	onClick?: () => void;
};

export function MedicalBillCard({
	usedAmount = 180000,
	totalLimit = 500000,
	onClick,
}: MedicalBillCardProps) {
	const remainingAmount = totalLimit - usedAmount;
	const progressPercent = (usedAmount / totalLimit) * 100;

	return (
		<NotificationCardWrapper
			gradientColor="#3182f6"
			shadowColor="rgba(0,132,133,0.08)"
		>
			<h2 className="whitespace-pre-line text-center font-bold text-[19px] text-hana-black-800 leading-6.5">
				이번달 요양보호사{"\n"}카드 지출{" "}
				<span className="text-hana-blue-500">
					{usedAmount.toLocaleString()}원
				</span>{" "}
				사용했어요
			</h2>

			<div className="mt-6 mb-4">
				<Image
					src="/images/asset/care-giver-payment.svg"
					alt=""
					width={153}
					height={125}
					aria-hidden="true"
					priority
				/>
			</div>

			<div className="w-full space-y-2">
				<div className="flex justify-center">
					<span className="font-medium text-[11px] text-hana-black-800">
						{usedAmount.toLocaleString()}원 / {totalLimit.toLocaleString()}원
					</span>
				</div>
				<div className="h-2.75 w-full rounded-full bg-hana-silver-100">
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${progressPercent}%` }}
						transition={{ duration: 1, ease: "easeOut" }}
						className="h-full rounded-full"
						style={{
							background: "linear-gradient(90deg, #194AA6 0%, #90C2FF 100%)",
						}}
					/>
				</div>
				<div className="flex justify-center pt-1">
					<span className="font-semibold text-[15px] text-hana-blue-600">
						한도 {remainingAmount.toLocaleString()}원 남았어요
					</span>
				</div>
			</div>

			<div className="mt-8 w-full">
				<NotificationButton variant="blue" onClick={onClick}>
					사용 내역 확인하기
				</NotificationButton>
			</div>
		</NotificationCardWrapper>
	);
}
