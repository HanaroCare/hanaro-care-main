"use client";

import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * 폰트 설정 페이지
 */
export default function FontConfigPage() {
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);
	const [selectedLevel, setSelectedLevel] = useState(2);

	const previewFontSizes: Record<number, string> = {
		1: "14.4px",
		2: "16px",
		3: "17.6px",
		4: "19.2px",
		5: "20.8px",
	};

	useEffect(() => {
		setIsMounted(true);
		const savedLevel = localStorage.getItem("font-level");
		const level = savedLevel ? Number(savedLevel) : 2;
		setSelectedLevel(level);

		setTimeout(() => {
			document.documentElement.setAttribute("data-font-level", String(level));
		}, 0);
	}, []);

	const handleLevelChange = (level: number) => {
		setSelectedLevel(level);
		if (typeof window !== "undefined") {
			document.documentElement.setAttribute("data-font-level", String(level));
			localStorage.setItem("font-level", String(level));
		}
	};

	return (
		<div className="app-shell bg-white shadow-2xl">
			<div className="app-layout" style={{ fontSize: "16px" }}>

				<main
					className="app-main flex flex-1 flex-col"
					style={{ padding: "48px 24px 0", fontSize: "16px" }}
				>
					<div className="text-center" style={{ marginBottom: "56px", fontSize: "16px" }}>
						<h2
							className="font-Hana Bold tracking-tight text-gray-900"
							style={{ fontSize: "24px", marginBottom: "12px" }}
						>
							글자 크기를 선택해주세요
						</h2>
						<p className="text-gray-500" style={{ fontSize: "16px" }}>
							편안하게 읽을 수 있는 크기로 조절하세요
						</p>
					</div>

					<div
						className="flex flex-col items-center justify-center bg-gray-50 transition-all duration-200"
						style={{
							minHeight: "180px",
							marginBottom: "40px",
							padding: "40px",
							borderRadius: "24px",
							fontSize: "16px"
						}}
					>
						<div className="space-y-2 text-center" style={{ fontSize: "16px" }}>
							<p
								className="font-Hana Medium tracking-snug text-gray-900"
								style={{
									fontSize: previewFontSizes[selectedLevel],
									transition: "font-size 0.2s"
								}}
							>
								이 글씨가 편하게 보이나요?
							</p>
							<p
								className="font-Hana Medium tracking-snug text-gray-500"
								style={{ fontSize: "14px" }}
							>
								슬라이더를 움직여 조절하세요
							</p>
						</div>
					</div>


					<div className="mt-auto" style={{ padding: '0 24px 40px', fontSize: '16px' }}>
						<div
							className="flex items-center justify-between"
							style={{ marginBottom: '16px', height: '32px' }}
						>
							<span
								className="font-Hana Medium text-gray-400 shrink-0"
								style={{ fontSize: "14px", width: '20px', textAlign: 'left' }}
							>
								가
							</span>

							<div className="flex-1" style={{ padding: '0 12px' }}>
								{isMounted ? (
									<input
										type="range"
										min="1"
										max="5"
										step="1"
										value={selectedLevel}
										onChange={(e) => handleLevelChange(Number(e.target.value))}
										className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-primary"
										style={{ height: '8px', margin: '0', display: 'block' }}
									/>
								) : (
									<div className="h-2.5 w-full rounded-full bg-gray-200" style={{ height: '8px' }} />
								)}
							</div>

							<span
								className="font-Hana Bold text-gray-900 shrink-0"
								style={{ fontSize: "24px", width: '30px', textAlign: 'right' }}
							>
								가
							</span>
						</div>

						<div
							className="flex justify-between font-Hana Medium text-gray-400"
							style={{ padding: '0 2px' }}
						>
							<span style={{ fontSize: '12px', lineHeight: '1' }}>작게</span>
							<span style={{ fontSize: '12px', lineHeight: '1' }}>크게</span>
						</div>
					</div>
				</main>

				<footer
					className="shrink-0 bg-background"
					style={{ padding: "24px 24px 48px" }}
				>
					<button
						type="button"
						onClick={() => router.push("/onboarding")}
						className="w-full bg-primary font-bold text-white transition-colors hover:bg-primary/90 active:scale-[0.98]"
						style={{
							height: "56px",
							fontSize: "18px",
							borderRadius: "16px"
						}}
					>
						설정 완료
					</button>
				</footer>
			</div>
		</div>
	);
}