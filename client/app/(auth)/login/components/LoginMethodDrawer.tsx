"use client";

import { Drawer } from "vaul";
import { Lock, ScanFace, Grid3X3 } from "lucide-react";

type LoginMethodDrawerProps = {
	onSelect: (mode: "password" | "faceid" | "pattern") => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export default function LoginMethodDrawer({ onSelect, open, onOpenChange }: LoginMethodDrawerProps) {
	const methods = [
		{ id: "password", label: "간편비밀번호", icon: Lock, desc: "6자리 숫자 입력" },
		{ id: "faceid", label: "Face ID", icon: ScanFace, desc: "생체 인식 로그인" },
		{ id: "pattern", label: "패턴", icon: Grid3X3, desc: "연결 선 그리기" },
	] as const;

	return (
		<Drawer.Root open={open} onOpenChange={onOpenChange}>
			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
				<Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[1.5rem] bg-white outline-none">
					<div className="mx-auto mt-[0.75rem] h-[0.25rem] w-[2.5rem] rounded-full bg-gray-200" />
					<div className="p-[1.5rem]">
						<Drawer.Title className="mb-[1.5rem] font-hana text-[1.125rem] font-semibold">
							로그인 방식 변경
						</Drawer.Title>
						<div className="flex flex-col gap-[1rem]">
							{methods.map((m) => (
								<button
									key={m.id}
									type="button"
									onClick={() => { onSelect(m.id); onOpenChange(false); }}
									className="flex items-center gap-[1rem] rounded-[1rem] border border-gray-100 p-[1.25rem] text-left active:bg-gray-50 transition-colors"
								>
									<div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-hana-green-50 text-primary">
										<m.icon className="h-[1.5rem] w-[1.5rem]" />
									</div>
									<div className="flex-1">
										<div className="font-semibold text-foreground">{m.label}</div>
										<div className="text-[0.8125rem] text-hana-black-500">{m.desc}</div>
									</div>
								</button>
							))}
						</div>
					</div>
					<div className="h-[2rem]" />
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
