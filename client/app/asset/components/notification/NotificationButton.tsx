'use client';

import type { ReactNode } from 'react';

type ButtonVariant = 'blue' | 'green' | 'yellow' | 'red';

type NotificationButtonProps = {
  onClick?: () => void;
  children: ReactNode;
  variant: ButtonVariant;
  className?: string;
};

const BUTTON_STYLES: Record<ButtonVariant, { base: string; shadow: string }> = {
  blue: {
    base: 'bg-hana-blue-500 hover:bg-hana-blue-600',
    shadow: '0 10px 4px rgba(144, 194, 255, 0.33)',
  },
  green: {
    base: 'bg-hana-green-700 hover:bg-hana-green-800',
    shadow: '0 8px 16px rgba(0, 132, 133, 0.1)',
  },
  yellow: {
    base: 'bg-hana-yellow-600 hover:bg-hana-yellow-700',
    shadow: '0 10px 4px rgba(250, 161, 49, 0.2)',
  },
  red: {
    base: 'bg-hana-red-500 hover:bg-hana-red-600',
    shadow: '0 10px 4px rgba(240, 68, 82, 0.2)',
  },
};

export function NotificationButton({
  onClick,
  children,
  variant,
  className = '',
}: NotificationButtonProps) {
  const { base, shadow } = BUTTON_STYLES[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10.5 w-full items-center justify-center rounded-[13px] font-semibold text-[14px] text-white transition-colors ${base} ${className}`}
      style={{ boxShadow: shadow }}
    >
      {children}
    </button>
  );
}
