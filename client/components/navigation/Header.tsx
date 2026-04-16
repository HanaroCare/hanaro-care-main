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
      className={`sticky top-0 z-50 flex h-[4.0625rem] w-full items-center justify-between border-black/10 border-b bg-white px-[1rem] ${className}`}
    >
      <div className="flex w-[2rem] items-center justify-start">
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            className="-ml-[0.25rem] p-[0.5rem] text-hana-black-900"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-[1.5rem] h-[1.5rem]" aria-hidden="true" />
          </button>
        )}
      </div>

      <h1 className="page-header-text flex-1 text-center text-hana-black-900">
        {title}
      </h1>

      <div className="flex w-[2rem] items-center justify-end">
        {showCloseButton && (
          <button
            type="button"
            onClick={handleClose}
            className="-mr-[0.25rem] p-[0.5rem] text-hana-black-900"
            aria-label="닫기"
          >
            <X className="w-[1.5rem] h-[1.5rem]" aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
}