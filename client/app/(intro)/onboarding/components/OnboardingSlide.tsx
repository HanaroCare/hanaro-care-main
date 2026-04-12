import Image from "next/image";
import type { ReactNode } from "react";

type OnboardingSlideProps = {
  title: ReactNode;
  subtitle: string;
  imagePath?: string;
  isFirst?: boolean;
};

/**
 * 온보딩 슬라이드 컴포넌트
 */
export default function OnboardingSlide({
  title,
  subtitle,
  imagePath,
  isFirst = false,
}: OnboardingSlideProps) {
  return (
    <main className="app-main flex flex-1 flex-col px-[1.5rem] pt-[2.5rem]">
      <div className="mb-[2rem] text-center">
        <h2 className="font-bold text-[1.5rem] text-foreground leading-snug tracking-tight whitespace-pre-line">
          {title}
        </h2>
        <p className="mt-[0.5rem] text-[1rem] text-muted-foreground font-medium">
          {subtitle}
        </p>
      </div>

      <div className="mb-[2rem] flex flex-1 flex-col items-center justify-center">
        <div className="flex min-h-[20rem] w-full flex-col items-center justify-center overflow-hidden rounded-[1.5rem] bg-card p-[0.5rem] shadow-lg">
          {isFirst ? (
            <div className="flex h-[10rem] w-[10rem] flex-col items-center justify-center rounded-[1rem] bg-gray-50">
              <span className="text-gray-400 text-[0.875rem] font-bold">하나로케어</span>
            </div>
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={imagePath ?? "/images/default-thumbnail.png"}
                alt="Onboarding"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
