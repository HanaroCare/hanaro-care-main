"use client";

import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginHeaderProps {
	title?: string;
}

export default function LoginHeader({ title = "로그인" }: LoginHeaderProps) {
	const router = useRouter();

	return (
		<header className="flex h-[3.5rem] items-center justify-between px-[1rem]">
			<button
				type="button"
				onClick={() => router.back()}
				className="flex h-[2.5rem] w-[2.5rem] items-center justify-start text-foreground transition-opacity active:opacity-50"
				aria-label="뒤로가기"
			>
				<ChevronLeft className="h-[1.5rem] w-[1.5rem]" />
			</button>

			<h1 className="font-hana text-[1rem] font-medium tracking-tight text-foreground">
				{title}
			</h1>

			<button
				type="button"
				onClick={() => router.push("/")}
				className="flex h-[2.5rem] w-[2.5rem] items-center justify-end text-foreground transition-opacity active:opacity-50"
				aria-label="닫기"
			>
				<X className="h-[1.5rem] w-[1.5rem]" />
			</button>
		</header>
	);
}
