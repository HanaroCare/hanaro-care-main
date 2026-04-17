"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import FaceIdAuth from "../components/FaceIdAuth";
import PatternAuth from "../components/PatternAuth";
import SimplePasswordAuth from "../components/SimplePasswordAuth";
import LoginMethodSheet from "../components/LoginMethodSheet";
import Header from "@/components/navigation/Header";
import PasswordExpiryModal from "../components/PasswordExpiryModal";
import { loginWithHanaCert, type LoginMeans } from "../actions/auth";

type AuthMode = "pattern" | "pin" | "faceid";

const MODE_TO_MEANS: Record<AuthMode, LoginMeans> = {
	pin: "SIMPLE_PASSWORD",
	pattern: "PATTERN",
	faceid: "FACEID",
};

const MODE_TO_LOGIN_ID: Record<AuthMode, string> = {
	pin: "Tsid",
	pattern: "TsidZ",
	faceid: "Tsid",
};

export default function HanaCertLoginPage() {
	const router = useRouter();

	const [authMode, setAuthMode] = useState<AuthMode>("pin");
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [errorKey, setErrorKey] = useState(0);
	const [isPwdExpiryOpen, setIsPwdExpiryOpen] = useState(false);
	const [pwdExpiryLoginId, setPwdExpiryLoginId] = useState("");

	const isLoadingRef = useRef(false);

	useEffect(() => {
		setError("");
	}, [authMode]);

	const handleAuthSuccess = useCallback(
		async (mode: AuthMode, value: string) => {
			if (isLoadingRef.current) return;
			isLoadingRef.current = true;
			setIsLoading(true);
			setError("");

			const maxAge = "max-age=31536000; path=/";

			if (mode === "faceid") {
				localStorage.setItem("HAS_SEEN_FONT_CONFIG", "true");
				localStorage.setItem("HAS_SEEN_ONBOARDING", "true");
				localStorage.setItem("AUTH_TYPE", "HANA_CERT");

				document.cookie = `HAS_SEEN_FONT_CONFIG=true; ${maxAge}`;
				document.cookie = `HAS_SEEN_ONBOARDING=true; ${maxAge}`;
				document.cookie = `AUTH_TYPE=HANA_CERT; ${maxAge}`;
				document.cookie = `ACCESS_TOKEN=FACE_ID_MOCK; ${maxAge}`;

				setTimeout(() => {
					setIsLoading(false);
					isLoadingRef.current = false;
					router.replace("/");
					setTimeout(() => {
						window.location.href = "/";
					}, 500);
				}, 800);
				return;
			}

			try {
				const result = await loginWithHanaCert(
					MODE_TO_LOGIN_ID[mode],
					MODE_TO_MEANS[mode],
					value,
				);

				if (result.ok) {
					localStorage.setItem("HAS_SEEN_FONT_CONFIG", "true");
					localStorage.setItem("HAS_SEEN_ONBOARDING", "true");
					localStorage.setItem("AUTH_TYPE", "HANA_CERT");

					document.cookie = `HAS_SEEN_FONT_CONFIG=true; ${maxAge}`;
					document.cookie = `HAS_SEEN_ONBOARDING=true; ${maxAge}`;
					document.cookie = `AUTH_TYPE=HANA_CERT; ${maxAge}`;

					// [시연 기간 비활성화] 비밀번호 만료 팝업 — 시연 종료 후 아래 주석 해제
					// if (result.isPasswordExpired) {
					//   setPwdExpiryLoginId(MODE_TO_LOGIN_ID[mode]);
					//   setIsPwdExpiryOpen(true);
					// } else {
					//   router.replace("/");
					// }
					router.replace("/");
					return;
				}

				setError(result.error);
				setErrorKey((k) => k + 1);
			} catch {
				setError("인증 과정에서 오류가 발생했습니다.");
			} finally {
				isLoadingRef.current = false;
				setIsLoading(false);
			}
		},
		[router],
	);

	const handlePatternSuccess = useCallback(
		(val: string) => handleAuthSuccess("pattern", val),
		[handleAuthSuccess],
	);
	const handlePinSuccess = useCallback(
		(val: string) => handleAuthSuccess("pin", val),
		[handleAuthSuccess],
	);
	const handleFaceIdSuccess = useCallback(
		(val: string) => handleAuthSuccess("faceid", val),
		[handleAuthSuccess],
	);

	const modeTitles: Record<AuthMode, string> = {
		pin: "비밀번호를 입력해주세요",
		pattern: "패턴을 그려주세요",
		faceid: "Face ID 인증",
	};

	return (
		<div className="app-shell bg-background">
			<PasswordExpiryModal
				isOpen={isPwdExpiryOpen}
				onClose={() => { setIsPwdExpiryOpen(false); router.replace("/"); }}
				onConfirm={() => {
					sessionStorage.setItem("RESET_LOGIN_ID", pwdExpiryLoginId);
					router.push("/login/reset-password");
					setIsPwdExpiryOpen(false);
				}}
			/>
			<div className="app-layout relative overflow-hidden flex flex-col h-full">
				<Header
					title="하나인증서 로그인"
					showBackButton={false}
					showCloseButton={false}
				/>

				<main className="app-main flex flex-1 flex-col items-center px-[1.5rem]">
					<div className="pt-[4rem] pb-[3rem] text-center">
						<h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
							{authMode === "faceid" ? (
								<>
									<span className="text-primary">Face ID</span> 인증
								</>
							) : (
								modeTitles[authMode]
							)}
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
								<PatternAuth
									key={errorKey}
									onSuccess={handlePatternSuccess}
								/>
							</div>
						)}
						{authMode === "pin" && (
							<SimplePasswordAuth
								key={errorKey}
								onSuccess={handlePinSuccess}
							/>
						)}
						{authMode === "faceid" && (
							<FaceIdAuth
								key={errorKey}
								onSuccess={handleFaceIdSuccess}
							/>
						)}
					</div>

					{error && !isLoading && (
						<p className="mb-[1.5rem] text-[0.75rem] font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
							{error}
						</p>
					)}
					{isLoading && (
						<p className="mb-[1.5rem] text-[0.75rem] font-medium text-hana-ez-600">
							인증 처리 중...
						</p>
					)}

					<div className="w-full pb-[3rem] pt-[2rem]">
						<button
							type="button"
							disabled={isLoading}
							onClick={() => setIsSheetOpen(true)}
							className="mx-auto flex items-center justify-center gap-1 text-[0.9375rem] font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 disabled:opacity-40"
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
						setError("");
						setErrorKey((k) => k + 1);
					}}
				/>
			</div>
		</div>
	);
}