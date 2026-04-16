"use client";

import Image from "next/image";
import { NotificationButton } from "./NotificationButton";
import { NotificationCardWrapper } from "./NotificationCardWrapper";
import Link from "next/link";
import {useRouter} from "next/navigation";

type PensionItem = {
	name: string;
	amount: number;
};

type PensionCardProps = {
	totalAmount?: number;
	items?: PensionItem[];
	href?: string;
};

export function PensionCard({
	totalAmount = 1300000,
	items = [
		{ name: "국민연금", amount: 300000 },
		{ name: "퇴직연금", amount: 800000 },
		{ name: "개인연금", amount: 200000 },
	],
								href = "/asset"
}: PensionCardProps) {
	const router = useRouter();

	return (
		<NotificationCardWrapper
			gradientColor="#FAA131"
			shadowColor="rgba(255,161,49,0.08)"
		>
			<h2 className="whitespace-pre-line text-center font-bold text-[19px] text-hana-black-800 leading-6.5">
				이번달 연금{"\n"}
				<span className="text-hana-yellow-700">
					{(totalAmount / 10000).toLocaleString()}만원
				</span>{" "}
				들어와요
			</h2>

			<div className="mt-4 mb-4">
				<Image
					src="/images/asset/pension-incoming-day.svg"
					alt=""
					width={160}
					height={102}
					aria-hidden="true"
					priority
				/>
			</div>

			<div className="mb-6 w-full space-y-2">
				{items.map((item) => (
					<div
						key={item.name}
						className="flex h-8 items-center justify-between rounded-[15px] border border-hana-silver-100 bg-white px-4"
					>
						<span className="font-medium text-[12px] text-hana-black-700">
							{item.name}
						</span>
						<span className="font-semibold text-[12px] text-hana-black-900">
							{(item.amount / 10000).toLocaleString()}만원
						</span>
					</div>
				))}
			</div>
			<NotificationButton variant="yellow" onClick={() => router.push(href)}
			>
				자산 현황 보러가기
			</NotificationButton>
		</NotificationCardWrapper>
	);
}
