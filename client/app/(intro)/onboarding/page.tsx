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
					<span className="text-primary">의료비·간병비</span><br />
					미리 계산해두세요
				</>
			),
			subtitle: "부족한 만큼 딱 맞게 상품 설계까지!",
			imagePath: "/images/onboarding/onboarding1.svg",
		},
		{
			title: (
				<>
					요양보호사 <span className="text-primary">전용 카드</span><br />
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
					<span className="text-primary">노후 준비</span> A to Z
				</>
			),
			subtitle: "상속·신탁 설계부터 임의후견인 등록까지 한번에",
			imagePath: "/images/onboarding/onboarding3.svg",
		},
	];

	const handleBack = () => {
		if (currentSlide > 0) {
			setCurrentSlide(prev => prev - 1);
		} else {
			router.push("/font-config");
		}
	};

	const handleNext = () => {
		if (currentSlide < slides.length - 1) {
			setCurrentSlide(currentSlide + 1);
		} else {
			setIsBottomSheetOpen(true);
		}
	};

	const handleNavigation = (path: string) => {
		localStorage.setItem("HAS_SEEN_ONBOARDING", "true");
		document.cookie = "HAS_SEEN_ONBOARDING=true; path=/; max-age=31536000";
		router.push(path);
	};

	return (
		<div className="app-shell relative overflow-hidden bg-background">
			<div className="app-layout">
				<Header title="서비스 소개" onBack={handleBack} />

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
					<div className="mb-[40px] w-full text-center">
						<h2 className="text-[24px] font-bold text-foreground">
							<span>처음</span> 오셨나요?
						</h2>
					</div>

					<div className="flex w-full flex-col gap-[12px]">
						<PrimaryButton
							label="회원가입"
							onClick={() => handleNavigation("/signup")}
							className="!h-[64px] !bg-white border border-gray-200 !text-gray-900 !text-[18px]"
						/>

						<PrimaryButton
							label="하나인증서로 로그인"
							onClick={() => handleNavigation("/login/hanaCert")}
							className="!h-[64px] !text-[18px]"
						/>
					</div>
				</div>
			</BottomSheet>
		</div>
	);
}