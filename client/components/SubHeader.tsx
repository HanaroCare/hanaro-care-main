'use client';

import { ChevronLeft, X } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';

interface SubHeaderProps<T extends string> {
  title: string;
  backUrl: Route<T> | URL;
  closeUrl?: Route<T> | URL;
}

export default function SubHeader<T extends string>({
  title,
  backUrl,
  closeUrl = '/inheritance' as Route<T>,
}: SubHeaderProps<T>) {
  return (
    <header className="flex h-[56px] shrink-0 items-center justify-between border-gray-100 border-b bg-white px-4 py-4">
      <Link
        href={backUrl as Route}
        className="-ml-2 p-2 text-gray-900"
        aria-label="뒤로 가기"
      >
        <ChevronLeft className="h-6 w-6" />
      </Link>

      <h1 className="font-semibold text-gray-900 text-lg">{title}</h1>

      <Link
        href={closeUrl as Route}
        className="-mr-2 p-2 text-gray-900"
        aria-label="닫기"
      >
        <X className="h-6 w-6" />
      </Link>
    </header>
  );
}
