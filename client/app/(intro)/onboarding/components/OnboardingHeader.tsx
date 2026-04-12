import { ChevronLeft } from "lucide-react";

type OnboardingHeaderProps = {
  onBack: () => void;
  title?: string;
};

/**
 * 온보딩 상단 헤더 컴포넌트
 */
export default function OnboardingHeader({
  onBack,
  title = "서비스 소개",
}: OnboardingHeaderProps) {
  return (
    <header className="flex h-[3.5rem] shrink-0 items-center justify-between border-b border-border bg-background px-[1rem]">
      <button
        type="button"
        onClick={onBack}
        className="p-[0.5rem] transition-opacity hover:opacity-70"
        aria-label="뒤로가기"
      >
        <ChevronLeft className="h-[1.5rem] w-[1.5rem] text-foreground" />
      </button>

      <h1 className="font-medium text-[1.125rem] text-foreground tracking-tight">
        {title}
      </h1>

      <div className="w-[2.5rem]" />
    </header>
  );
}
