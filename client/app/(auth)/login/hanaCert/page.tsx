"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import FaceIdAuth from "../components/FaceIdAuth";
import PatternAuth from "../components/PatternAuth";
import SimplePasswordAuth from "../components/SimplePasswordAuth";
import LoginMethodSheet from "../components/LoginMethodSheet";

type AuthMode = "pattern" | "pin" | "faceid";

/**
 * 하나인증서 간편 로그인 페이지
 */
export default function HanaCertLoginPage() {
	const router = useRouter();

	const [authMode, setAuthMode] = useState<AuthMode>("pin");
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const [isVerified, setIsVerified] = useState(false);
	const handleAuthSuccess = useCallback(async (mode: AuthMode) => {
		console.log(`${mode} 인증 시도...`);

		// TODO: 실제 API 검증 로직이 들어갈 자리
		const verificationSuccess = true;

		if (verificationSuccess) {
			setIsVerified(true);
			router.replace("/");
		} else {
			alert("인증에 실패했습니다. 다시 시도해주세요.");
		}
	}, [router]);

	const modeTitles: Record<AuthMode, string> = {
		pin: "비밀번호를 입력해주세요",
		pattern: "패턴을 그려주세요",
		faceid: "Face ID 인증",
	};

	return (
		<div className="app-shell bg-background">
			<div className="app-layout relative overflow-hidden flex flex-col h-full">
				{/* <Header
					title="하나인증서 로그인"
					showBackButton={true}
					showCloseButton={false}
				/> */}

				<main className="app-main flex flex-1 flex-col items-center px-[1.5rem]">
					<div className="pt-[4rem] pb-[3rem] text-center">
						<h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
							{modeTitles[authMode]}
						</h2>
						<p className="mt-[0.75rem] text-[0.9375rem] text-muted-foreground">
							{authMode === "faceid"
								? "기기에 등록된 생체 정보를 확인합니다"
								: "본인 확인을 위해 인증을 진행합니다"}
						</p>
					</div>

					<div className="flex-1 w-full">
						{authMode === "pattern" && (
							<div className="flex justify-center">
								<PatternAuth onSuccess={() => handleAuthSuccess("pattern")} />
							</div>
						)}
						{authMode === "pin" && (
							<SimplePasswordAuth onSuccess={() => handleAuthSuccess("pin")} />
						)}
						{authMode === "faceid" && (
							<FaceIdAuth onSuccess={() => handleAuthSuccess("faceid")} />
						)}
					</div>

					<div className="w-full pb-[3rem] pt-[2rem]">
						<button
							type="button"
							onClick={() => setIsSheetOpen(true)}
							className="mx-auto flex items-center justify-center gap-1 text-[0.9375rem] font-medium text-muted-foreground hover:text-foreground underline underline-offset-4"
						>
							다른 방법으로 로그인
						</button>
					</div>
				</main>

				<LoginMethodSheet
					isOpen={isSheetOpen}
					onClose={() => setIsSheetOpen(false)}
					currentMode={authMode}
					onSelect={(mode) => {
						setAuthMode(mode as AuthMode);
						setIsSheetOpen(false);
						setIsVerified(false);
					}}
				/>
			</div>
		</div>
	);
}