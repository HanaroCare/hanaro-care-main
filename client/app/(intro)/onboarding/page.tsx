"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import OnboardingSlide from "./components/OnboardingSlide";
import PrimaryButton from "@/components/baseelements/PrimaryButton";
import Header from "@/components/navigation/Header";
import BottomSheet from "@/components/modules/BottomSheet";

export default function OnboardingPage() {
	const router = useRouter();
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

	const slides = [
		{
			title: (
				<>
					내게 맞는<br />
					<span className="text-primary">진짜</span> 노후 설계
				</>
			),
			subtitle: "자산은 안전하게 생활비는 풍족하게",
		},
		{
			title: (
				<>
					의료비·간병비<br />
					미리 계산해두세요
				</>
			),
			subtitle: "부족한 만큼 딱 맞게 상품 설계까지!",
			imagePath: "/images/onboarding/onboarding1.svg",
		},
		{
			title: (
				<>
					요양보호사 전용 카드<br />
					가족이 함께 관리해요
				</>
			),
			subtitle: "내역 확인부터 한도 설정까지 간편하게",
			imagePath: "/images/onboarding/onboarding2.svg",
		},
		{
			title: (
				<>
					건강할 때 챙겨야 하는<br />
					노후 준비 A to Z
				</>
			),
			subtitle: "상속·신탁 설계부터 임의후견인 등록까지 한번에",
			imagePath: "/images/onboarding/onboarding3.svg",
		},
	];

	const handleNext = () => {
		if (currentSlide < slides.length - 1) {
			setCurrentSlide(currentSlide + 1);
		} else {
			setIsBottomSheetOpen(true);
		}
	};

	// 경로 이동 및 온보딩 확인 여부 저장
	const handleNavigation = (path: string) => {
		localStorage.setItem("HAS_SEEN_ONBOARDING", "true");
		router.push(path);
	};

	return (
		<div className="app-shell relative overflow-hidden bg-background">
			<div className="app-layout">
				<Header title="서비스 소개" />

				<ProgressBar currentStep={currentSlide + 1} totalSteps={slides.length} />

				<OnboardingSlide
					title={slides[currentSlide].title}
					subtitle={slides[currentSlide].subtitle}
					imagePath={slides[currentSlide].imagePath}
					isFirst={currentSlide === 0}
				/>

				<footer className="shrink-0 bg-background p-[1.5rem] pb-[3rem]">
					<PrimaryButton
						onClick={handleNext}
						label={currentSlide === slides.length - 1 ? "시작하기" : "다음"}
					/>
				</footer>
			</div>

			<BottomSheet
				isOpen={isBottomSheetOpen}
				onClose={() => setIsBottomSheetOpen(false)}
			>
				<div className="flex w-full flex-col">
					<div className="mb-[2.5rem] w-full text-center">
						<h2 className="text-[1.5rem] font-bold text-foreground">
							처음 오셨나요?
						</h2>
					</div>

					<div className="flex w-full flex-col gap-3">
						<PrimaryButton
							label="회원가입"
							onClick={() => handleNavigation("/signup")}
							className="!h-[4rem] !bg-white border border-gray-200 !text-gray-900 !text-[1.125rem]"
						/>

						<PrimaryButton
							label="하나인증서로 로그인"
							onClick={() => handleNavigation("/login/hanaCert")}
							className="!h-[4rem] !text-[1.125rem]"
						/>
					</div>
				</div>
			</BottomSheet>
		</div>
	);
}