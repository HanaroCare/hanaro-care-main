"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import OnboardingBottomSheet from "./components/OnboardingBottomSheet";
import OnboardingHeader from "./components/OnboardingHeader";
import OnboardingSlide from "./components/OnboardingSlide";
import PrimaryButton from "@/components/PrimaryButton";

/**
 * 온보딩 페이지
 */
export default function OnboardingPage() {
	const router = useRouter();
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

	const slides = [
		{
			title: (
				<>
					내게 맞는
					<br />
					<span className="text-primary">진짜</span> 노후 설계
				</>
			),
			subtitle: "자산은 안전하게 생활비는 풍족하게",
		},
		{
			title: (
				<>
					의료비·간병비
					<br />
					미리 계산해두세요
				</>
			),
			subtitle: "부족한 만큼 딱 맞게 상품 설계까지!",
			imagePath: "/images/onboarding/onboarding1.svg",
		},
		{
			title: (
				<>
					요양보호사 전용 카드
					<br />
					가족이 함께 관리해요
				</>
			),
			subtitle: "내역 확인부터 한도 설정까지 간편하게",
			imagePath: "/images/onboarding/onboarding2.svg",
		},
		{
			title: (
				<>
					건강할 때 챙겨야 하는
					<br />
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

	const handleBack = () => {
		if (currentSlide > 0) {
			setCurrentSlide(currentSlide - 1);
		} else {
			router.back();
		}
	};

	return (
		<div className="app-shell relative overflow-hidden bg-background">
			<div className="app-layout">
				<OnboardingHeader onBack={handleBack} />

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

			<OnboardingBottomSheet
				isOpen={isBottomSheetOpen}
				onClose={() => setIsBottomSheetOpen(false)}
			/>
		</div>
	);
}
