type PrimaryButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'disabled';
  fullWidth?: boolean;
  className?: string;
  icon?: React.ReactNode;
};

export default function PrimaryButton({
  label,
  disabled = false,
  onClick,
  variant = 'primary',
  fullWidth = true,
  className = '',
  icon,
}: PrimaryButtonProps) {
  const isDisabled = disabled || variant === 'disabled';
  const resolvedVariant = isDisabled ? 'disabled' : variant;

  const variantClass =
    resolvedVariant === 'primary'
      ? 'bg-hana-ez-600 text-white'
      : resolvedVariant === 'secondary'
        ? 'bg-[#E9F8F9] text-hana-ez-600'
        : 'bg-[#F3F4F6] text-[#9CA3AF]';

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={`
        ${fullWidth ? 'w-full' : ''} h-14 rounded-[10px] text-[17px] ${variantClass} font-semibold transition flex items-center justify-center gap-2 ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </button>
  );
}
