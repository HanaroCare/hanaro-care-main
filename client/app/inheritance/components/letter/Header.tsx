'use client';

import { ChevronLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between border-gray-100 border-b px-4 py-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="rounded-full p-1 transition-colors hover:bg-gray-100"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" strokeWidth={2} />
      </button>
      <h1 className="font-semibold text-base text-gray-900">상속 편지</h1>
      <button
        type="button"
        onClick={() => router.back()}
        className="rounded-full p-1 transition-colors hover:bg-gray-100"
      >
        <X className="h-6 w-6 text-gray-700" strokeWidth={2} />
      </button>
    </div>
  );
}
