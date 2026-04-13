export function ScenarioValueCard({
  label,
  share,
  value,
  selected,
  onClick,
  color,
  bgColor,
}: {
  label: string;
  share: string;
  value: string;
  selected: boolean;
  onClick: () => void;
  color: string;
  bgColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 flex-col items-center rounded-3xl px-4 py-3 text-center transition"
      style={{
        backgroundColor: selected ? bgColor : '#F3F4F6',
      }}
    >
      <p
        className="text-[12px] leading-4 font-semibold"
        style={{ color: selected ? color : '#C0C4CC' }}
      >
        {label}({share})
      </p>
      <p
        className="mt-1 text-[14px] leading-5 font-bold"
        style={{ color: selected ? color : '#B4B8BF' }}
      >
        {value}
      </p>
    </button>
  );
}
