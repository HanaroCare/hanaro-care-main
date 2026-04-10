type TrustNextButtonProps = {
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
};

export default function TrustNextButton({
  label = "다음으로",
  disabled = false,
  onClick,
}: TrustNextButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`h-14 w-full rounded-xl text-base leading-6 font-semibold tracking-tight transition ${
        disabled ? "bg-[#E5E7EB] text-[#9CA3AF]" : "bg-hana-ez-600 text-white"
      }`}
    >
      {label}
    </button>
  );
}
