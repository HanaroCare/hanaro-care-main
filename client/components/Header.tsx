'use client';
import { ChevronLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="-translate-x-1/2 fixed top-0 left-1/2 z-50 w-full max-w-93.75">
      <div className="flex w-full items-center justify-between border-gray-100 border-b bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full p-1 transition-colors hover:bg-gray-100"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="font-semibold text-base text-gray-900">{title}</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full p-1 transition-colors hover:bg-gray-100"
        >
          <X className="h-6 w-6 text-gray-700" strokeWidth={2} />
        </button>
      </div>
      <div className="h-px bg-gray-300" />
    </div>
  );
}
