import type { InheritanceMethod } from "../../types";

interface Props {
  value: InheritanceMethod;
  onChange: (value: InheritanceMethod) => void;
}
const OPTIONS: { label: string; value: InheritanceMethod }[] = [
  { label: "한번에", value: "once" },
  { label: "나눠서", value: "divided" },
];

export default function InheritanceMethodToggle({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-gray-900">상속 방식</span>
      <div className="flex gap-3">
        {OPTIONS.map((option) => (
          <button
            type="button"
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
              value === option.value
                ? "bg-[#E9F8F9] border-hana-green-700 text-hana-green-700"
                : "bg-white border-gray-200 text-gray-500"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
