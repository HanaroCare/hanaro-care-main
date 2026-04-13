"use client";

import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

type LoginHeaderProps = {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
};

/**
 * 로그인 시스템 및 마이데이터 플로우용 공통 헤더
 */
export default function LoginHeader({
  title,
  onBack,
  onClose,
}: LoginHeaderProps) {
  const router = useRouter();

  const handleBack = onBack || (() => router.back());
  const handleClose = onClose || (() => router.push("/"));

  return (
    <header className="flex h-[3.5rem] shrink-0 items-center justify-between border-b border-border bg-background px-[1rem]">
      <button
        type="button"
        onClick={handleBack}
        className="p-[0.5rem] transition-opacity hover:opacity-70"
        aria-label="뒤로가기"
      >
        <ChevronLeft className="h-[1.5rem] w-[1.5rem] text-foreground" />
      </button>

      <h1 className="font-medium text-[1.125rem] text-foreground tracking-tight">
        {title}
      </h1>

      <button
        type="button"
        onClick={handleClose}
        className="p-[0.5rem] transition-opacity hover:opacity-70"
        aria-label="닫기"
      >
        <X className="h-[1.5rem] w-[1.5rem] text-foreground" />
      </button>
    </header>
  );
}
