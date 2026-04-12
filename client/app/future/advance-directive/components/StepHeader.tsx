'use client';

import { ChevronLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Route } from 'next';

interface StepHeaderProps {
  title: string;
  exitHref: Route;
}

export default function StepHeader({ title, exitHref }: StepHeaderProps) {
  const router = useRouter();
  return (
    <div className="flex flex-row justify-between items-center px-4 h-[65px] border-b border-black/10">
      <button onClick={() => router.back()} className="p-1">
        <ChevronLeft size={24} color="#0A0A0A" />
      </button>
      <span className="font-medium text-[16px] leading-[24px] tracking-[-0.04em] text-[#0A0A0A]">{title}</span>
      <button onClick={() => router.push(exitHref)} className="p-1">
        <X size={24} color="#0A0A0A" />
      </button>
    </div>
  );
}