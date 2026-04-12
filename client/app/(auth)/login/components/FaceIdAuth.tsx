"use client";

import { motion } from "framer-motion";
import { ScanFace } from "lucide-react";
import { useEffect } from "react";

interface FaceIdAuthProps {
	onSuccess: () => void;
}

export default function FaceIdAuth({ onSuccess }: FaceIdAuthProps) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onSuccess();
		}, 2000);

		return () => clearTimeout(timer);
	}, [onSuccess]);

	return (
		<div className="flex flex-col items-center justify-center pt-[5rem]">
			<div className="relative mb-[3rem] flex h-[9rem] w-[9rem] items-center justify-center">
				<motion.div
					className="absolute h-full w-full rounded-full border-[3px] border-primary border-t-transparent"
					animate={{ rotate: 360 }}
					transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
				/>
				<ScanFace className="h-[4.5rem] w-[4.5rem] text-primary" />
			</div>

			<p className="text-center text-[1.125rem] font-medium text-foreground">
				Face ID로 로그인 중입니다
			</p>
			<p className="mt-[0.75rem] text-center text-[0.875rem] text-hana-black-500">
				카메라를 정면으로 응시해 주세요
			</p>
		</div>
	);
}
