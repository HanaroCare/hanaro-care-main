"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Fingerprint, Grid3X3, KeyRound } from "lucide-react";
import { useEffect } from "react";

type AuthMode = "pattern" | "pin" | "faceid";

type LoginMethodSheetProps = {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (mode: AuthMode) => void;
	currentMode: AuthMode;
};

/**
 * 로그인 수단 선택 바텀 시트 (자체 모달 로직 사용)
 */
export default function LoginMethodSheet({
	isOpen,
	onClose,
	onSelect,
	currentMode,
}: LoginMethodSheetProps) {

	useEffect(() => {
		if (!isOpen) return;
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prevOverflow;
		};
	}, [isOpen]);

	const methods: { id: AuthMode; label: string; icon: any }[] = [
		{ id: "pin", label: "간편비밀번호", icon: KeyRound },
		{ id: "faceid", label: "Face ID", icon: Fingerprint },
		{ id: "pattern", label: "패턴", icon: Grid3X3 },
	];

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
					/>

					<motion.div
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 300 }}
						className="fixed bottom-0 left-1/2 z-[60] flex w-full max-w-[375px] -translate-x-1/2 flex-col rounded-t-[1.5rem] bg-white pb-[3rem] pt-[1.25rem] shadow-2xl"
					>
						<div className="mx-auto mb-[1.5rem] h-[0.375rem] w-[3rem] rounded-full bg-gray-200" />

						<h3 className="mb-[1.5rem] px-[1.5rem] text-[1.25rem] font-bold text-foreground">
							로그인 방법 선택
						</h3>

						<div className="flex flex-col">
							{methods.map((method) => {
								const Icon = method.icon;
								const isActive = currentMode === method.id;

								return (
									<button
										key={method.id}
										onClick={() => {
											onSelect(method.id);
											onClose();
										}}
										className="flex items-center justify-between px-[1.5rem] py-[1.25rem] transition-colors active:bg-gray-50"
									>
										<div className="flex items-center gap-[1rem]">
											<div className={`flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full ${isActive ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>
												<Icon size={20} />
											</div>
											<span className={`text-[1.0625rem] ${isActive ? "font-bold text-primary" : "font-medium text-gray-700"}`}>
												{method.label}
											</span>
										</div>
										<ChevronRight size={20} className="text-gray-300" />
									</button>
								);
							})}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
