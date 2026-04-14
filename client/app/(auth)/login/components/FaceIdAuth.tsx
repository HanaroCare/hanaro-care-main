"use client";

import { motion } from "framer-motion";
import { ScanFace } from "lucide-react";
import { useEffect, useState } from "react";

type FaceIdAuthProps = {
	onSuccess: () => void;
};

/**
 * Face ID 인증 시뮬레이션 컴포넌트 (UI Mock)
 */
export default function FaceIdAuth({ onSuccess }: FaceIdAuthProps) {
	const [status, setStatus] = useState<"scanning" | "success">("scanning");

	useEffect(() => {
		// 2.5초 후 자동으로 성공 처리
		const timer = setTimeout(() => {
			setStatus("success");
			setTimeout(() => {
				onSuccess();
			}, 800);
		}, 2500);

		return () => clearTimeout(timer);
	}, [onSuccess]);

	return (
		<div className="flex flex-col items-center justify-center pt-[5rem]">
			<div className="relative mb-[3rem] flex h-[9rem] w-[9rem] items-center justify-center">
				<motion.div
					className={`absolute h-full w-full rounded-full border-[3px] transition-colors duration-500 ${status === "success" ? "border-hana-green-500" : "border-primary border-t-transparent"
						}`}
					animate={status === "scanning" ? { rotate: 360 } : { rotate: 0 }}
					transition={status === "scanning" ? { duration: 1.5, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
				/>
				<ScanFace
					className={`h-[4.5rem] w-[4.5rem] transition-colors duration-500 ${status === "success" ? "text-hana-green-500" : "text-primary"
						}`}
				/>
			</div>

			<p className="text-center text-[1.125rem] font-bold text-foreground">
				{status === "scanning" ? "Face ID 인증 중" : "인증 완료"}
			</p>
			<p className="mt-[0.75rem] text-center text-[0.875rem] text-hana-black-500">
				{status === "scanning" ? "카메라를 정면으로 응시해 주세요" : "잠시만 기다려 주세요"}
			</p>

			{/* {status === "scanning" && (
				<button 
					onClick={onSuccess}
					className="mt-12 text-[0.875rem] font-medium text-primary underline underline-offset-4"
				>
					즉시 인증하기 
				</button>
			)} */}
		</div>
	);
}
