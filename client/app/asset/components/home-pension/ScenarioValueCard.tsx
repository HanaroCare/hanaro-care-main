type Props = {
  label: string;
  value: string;
  color: string;
  bgColor: string;
  selected?: boolean;
  onClick?: () => void;
  badge?: string;
};

export function ScenarioValueCard({
  label,
  value,
  color,
  bgColor,
  selected,
  onClick,
  badge,
}: Props) {
  return (
    <div className="relative flex-1 pt-10">
      {badge ? (
        <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2">
          <div className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full bg-[#FCECEC] px-7 text-[15px] font-medium text-[#EF4444]">
            {badge}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onClick}
        className="flex h-[90px] w-full flex-col items-center justify-center rounded-[18px] px-4 text-center transition"
        style={{
          backgroundColor: selected ? bgColor : '#F3F4F6',
          border: selected ? `2px solid ${color}` : '2px solid transparent',
        }}
      >
        <p
          className="text-[16px] leading-6 font-semibold"
          style={{ color: selected ? color : '#111827' }}
        >
          {label}
        </p>

        <p
          className="mt-3 text-[px] leading-[1] font-bold tracking-tight"
          style={{ color: selected ? color : '#111827' }}
        >
          {value}
        </p>
      </button>
    </div>
  );
}
