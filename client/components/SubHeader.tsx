'use client';

import React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ChevronLeft, X } from 'lucide-react';

interface SubHeaderProps<T extends string> {
  title: string;
  backUrl?: Route<T> | URL;
  closeUrl?: Route<T> | URL;
  onBack?: () => void;
  onClose?: () => void;
}

export default function SubHeader<T extends string>({ 
  title, 
  backUrl, 
  closeUrl,
  onBack,
  onClose
}: SubHeaderProps<T>) {
  const renderBackAction = () => {
    if (onBack) {
      return (
        <button onClick={onBack} className="p-2 -ml-2 text-gray-900" aria-label="뒤로 가기">
          <ChevronLeft className="w-6 h-6" />
        </button>
      );
    }
    if (backUrl) {
      return (
        <Link href={backUrl} className="p-2 -ml-2 text-gray-900" aria-label="뒤로 가기">
          <ChevronLeft className="w-6 h-6" />
        </Link>
      );
    }
    return <div className="w-10" />; // Placeholder to maintain spacing
  };

  const renderCloseAction = () => {
    if (onClose) {
      return (
        <button onClick={onClose} className="p-2 -mr-2 text-gray-900" aria-label="닫기">
          <X className="w-6 h-6" />
        </button>
      );
    }
    if (closeUrl) {
      return (
        <Link href={closeUrl} className="p-2 -mr-2 text-gray-900" aria-label="닫기">
          <X className="w-6 h-6" />
        </Link>
      );
    }
    return <div className="w-10" />; // Placeholder
  };

  return (
    <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 shrink-0 h-[56px] sticky top-0 z-50">
      {renderBackAction()}
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      {renderCloseAction()}
    </header>
  );
}
