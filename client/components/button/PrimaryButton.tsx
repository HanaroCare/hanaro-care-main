type PrimaryButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'disabled';
  fullWidth?: boolean;
  className?: string;
};

export default function PrimaryButton({
  label,
  disabled = false,
  onClick,
  variant = 'primary',
  fullWidth = true,
  className = '',
}: PrimaryButtonProps) {
  const resolvedVariant = disabled ? 'disabled' : variant;

  const variantClass =
    resolvedVariant === 'primary'
      ? 'bg-hana-ez-600 text-white'
      : resolvedVariant === 'secondary'
        ? 'bg-[#E9F8F9] text-hana-ez-600'
        : 'bg-[#F3F4F6] text-[#9CA3AF]';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        ${fullWidth ? 'w-full' : ''} h-14 rounded-[10px] text-[17px] ${variantClass} font-semibold transition ${className}
      `}
    >
      {label}
    </button>
  );
}
