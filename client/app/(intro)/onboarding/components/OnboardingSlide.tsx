'use client';

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
        <div className="flex min-h-[20rem] w-full flex-col items-center justify-center overflow-hidden rounded-[1.5rem] bg-card shadow-lg p-8">
          {isFirst ? (
            <div className="relative h-[12rem] w-[12rem]">
              <Image
                src="/images/onboarding/logo.svg"
                alt="하나케어 로고"
                fill
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="relative w-full aspect-square scale-110">
              <Image
                src={imagePath || "/images/onboarding/logo.svg"}
                alt="온보딩 이미지"
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