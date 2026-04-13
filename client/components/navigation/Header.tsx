'use client';

import { ChevronLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  title?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
};

export default function Header({
  title,
  showBackButton = true,
  showCloseButton = false,
  onBack,
  onClose,
  className = '',
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 flex h-16.25 w-full items-center justify-between border-black/10 border-b bg-white px-4 ${className}`}
    >
      <div className="flex w-8 items-center justify-start">
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            className="-ml-1 p-2 text-hana-black-900"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>
        )}
      </div>

      <h1 className="page-header-text flex-1 text-center text-hana-black-900">
        {title}
      </h1>

      <div className="flex w-8 items-center justify-end">
        {showCloseButton && (
          <button
            type="button"
            onClick={handleClose}
            className="-mr-1 p-2 text-hana-black-900"
            aria-label="닫기"
          >
            <X size={24} aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
}
