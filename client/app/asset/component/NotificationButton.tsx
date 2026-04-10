'use client';

type ButtonVariant = 'blue' | 'green' | 'yellow' | 'red';

type NotificationButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  variant: ButtonVariant;
};

const BUTTON_STYLES: Record<ButtonVariant, { base: string; shadow: string }> = {
  blue: {
    base: 'bg-hana-blue-500 hover:bg-hana-blue-600',
    shadow: '0_10px_4px_rgba(144,194,255,0.33)',
  },
  green: {
    base: 'bg-hana-green-700 hover:bg-hana-green-800',
    shadow: '0_8px_16px_rgba(0,132,133,0.1)',
  },
  yellow: {
    base: 'bg-hana-yellow-600 hover:bg-hana-yellow-700',
    shadow: '0_10px_4px_rgba(250,161,49,0.2)',
  },
  red: {
    base: 'bg-hana-red-500 hover:bg-hana-red-600',
    shadow: '0_10px_4px_rgba(240,68,82,0.2)',
  },
};

export function NotificationButton({
  onClick,
  children,
  variant,
}: NotificationButtonProps) {
  const { base, shadow } = BUTTON_STYLES[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[42px] w-full items-center justify-center rounded-[13px] font-semibold text-[14px] text-white transition-colors ${base}`}
      style={{ boxShadow: shadow }}
    >
      {children}
    </button>
  );
}
