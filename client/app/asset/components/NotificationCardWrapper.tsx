'use client';

import { X } from 'lucide-react';
import { type ReactNode, useState } from 'react';

type NotificationCardWrapperProps = {
  children: ReactNode;
  gradientColor: string;
  shadowColor: string;
};

export function NotificationCardWrapper({
  children,
  gradientColor,
  shadowColor,
}: NotificationCardWrapperProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className="relative w-81.25 overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: `0 20px 30px ${shadowColor}` }}
    >
      {/* 그라디언트 배경 - z-0 */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 43%, ${gradientColor} 0%, #ffffff 100%)`,
        }}
      />

      {/* X 버튼 - z-10으로 그라디언트 위에 */}
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 z-10 flex size-6 items-center justify-center rounded-full bg-white/50 outline-none backdrop-blur-sm transition-colors hover:bg-white"
      >
        <X size={12} className="text-hana-black-500" />
      </button>

      {/* 컨텐츠 - z-10 */}
      <div className="relative z-10 flex flex-col items-center p-8 pt-10">
        {children}
      </div>
    </div>
  );
}
