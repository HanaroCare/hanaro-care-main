"use client";

import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavigationBar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex h-[3.5rem] items-center justify-between border-b border-gray-100 bg-white/90 px-[1rem] backdrop-blur-md">
      <button onClick={() => router.back()} className="rounded-full p-[0.5rem] hover:bg-gray-50 transition-colors">
        <ChevronLeft className="h-[1.5rem] w-[1.5rem] text-gray-800" strokeWidth={2.5} />
      </button>
      <h1 className="text-[1rem] font-bold text-gray-900 tracking-tight">{title}</h1>
      <button onClick={() => router.push("/")} className="rounded-full p-[0.5rem] hover:bg-gray-50 transition-colors">
        <X className="h-[1.5rem] w-[1.5rem] text-gray-800" strokeWidth={2.5} />
      </button>
    </header>
  );
}
