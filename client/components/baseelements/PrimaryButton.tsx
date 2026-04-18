type PrimaryButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'third' | 'disabled' | 'warning';
  fullWidth?: boolean;
  className?: string;
  icon?: React.ReactNode;
};

export default function PrimaryButton({
  label,
  disabled = false,
  onClick,
  type = 'button',
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
            : resolvedVariant === 'third'
                ? 'bg-hana-teal-600 text-white active:bg-hana-teal-700'
                  : resolvedVariant === 'disabled'
                    ? 'bg-[#F3F4F6] text-[#9CA3AF]'
                    : 'bg-hana-red-500 text-white';

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        ${fullWidth ? 'w-full' : ''} h-14 rounded-[10px] text-[17px] ${variantClass} flex items-center justify-center gap-2 font-semibold transition ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </button>
  );
}
