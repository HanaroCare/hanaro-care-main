"use client";

import Image from "next/image";
import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
					내게 맞는<br />
					<span className="text-primary">진짜</span> 노후 설계
				</>
			),
			subtitle: "자산은 안전하게 생활비는 풍족하게"
		},
		{
			title: (
				<>
					의료비·간병비<br />
					미리 계산해두세요
				</>
			),
			subtitle: "부족한 만큼 딱 맞게 상품 설계까지!",
			imagePath: "/img/onboarding1.png",
		},
		{
			title: (
				<>
					요양보호사 전용 카드<br />
					가족이 함께 관리해요
				</>
			),
			subtitle: "내역 확인부터 한도 설정까지 간편하게",
			imagePath: "/img/onboarding2.png",
		},
		{
			title: (
				<>
					건강할 때 챙겨야 하는<br />
					노후 준비 A to Z
				</>
			),
			subtitle: "상속·신탁 설계부터 임의후견인 등록까지 한번에",
			imagePath: "/img/onboarding3.png",
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

				<header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
					<button
						type="button"
						onClick={handleBack}
						className="p-2 transition-opacity hover:opacity-70"
						aria-label="뒤로가기"
					>
						<ChevronLeft className="h-6 w-6 text-foreground" />
					</button>

					<h1 className="font-medium text-foreground text-lg tracking-tight">
						서비스 소개
					</h1>

					<div className="w-10" />
				</header>

				<div className="h-1 w-full shrink-0 bg-border">
					<div
						className="h-full bg-primary transition-all duration-300"
						style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
					/>
				</div>

				<main className="app-main flex flex-1 flex-col px-6 pt-10">
					<div className="mb-8 text-center">
						<h2 className="font-bold text-2xl text-foreground leading-snug tracking-tight whitespace-pre-line">
							{slides[currentSlide].title}
						</h2>
						<p className="mt-2 text-base text-muted-foreground">
							{slides[currentSlide].subtitle}
						</p>
					</div>

					<div className="mb-8 flex flex-1 flex-col items-center justify-center">
						<div className="flex min-h-80 w-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-card p-6 shadow-lg">
							{currentSlide === 0 ? (
								<div className="flex h-40 w-40 flex-col items-center justify-center rounded-2xl bg-gray-100">
									<span className="text-gray-400 text-sm font-medium">로고 넣기</span>
								</div>
							) : (
								<div className="relative h-full w-full">
									<Image
										src={slides[currentSlide]?.imagePath ?? "/images/default-thumbnail.png"}
										alt={`Onboarding ${currentSlide + 1}`}
										fill
										className="object-contain"
										priority
									/>
								</div>
							)}
						</div>
					</div>
				</main>

				<footer className="shrink-0 bg-background p-6 pb-12">
					<PrimaryButton
						label={currentSlide === slides.length - 1 ? "시작하기" : "다음"}
						onClick={handleNext}
					/>
				</footer>
			</div>

			{isBottomSheetOpen && (
				<>

					<div
						className="absolute inset-0 z-40 bg-black/50 transition-opacity animate-in fade-in"
						onClick={() => setIsBottomSheetOpen(false)}
						onKeyDown={(e) => e.key === "Escape" && setIsBottomSheetOpen(false)}
						role="button"
						tabIndex={0}
						aria-label="바텀시트 닫기"
					/>

					<div className="absolute bottom-0 left-0 right-0 z-50 flex flex-col items-center rounded-t-[25px] bg-card p-6 pt-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-300">

						<div className="flex w-full items-center justify-center pb-7">
							<div className="h-1.5 w-12 rounded-full bg-gray-300" />
						</div>

						<p className="mb-8 font-bold text-foreground text-xl">
							처음 오셨나요?
						</p>
						<div className="flex w-full flex-col gap-3">
							<button
								type="button"
								onClick={() => router.push("/signup")}
								className="h-14 w-full rounded-2xl border border-border bg-white font-bold text-foreground text-lg transition-colors active:scale-[0.98] hover:bg-gray-50"
							>
								회원가입
							</button>
							<button
								type="button"
								onClick={() => router.push("/login")}
								className="h-14 w-full rounded-2xl bg-primary font-bold text-lg text-white transition-colors active:scale-[0.98] hover:bg-primary/90"
							>
								하나인증서로 로그인
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
