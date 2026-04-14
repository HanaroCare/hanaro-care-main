"use client";

interface YesNoSelectorProps {
  selected: "yes" | "no" | null;
  onSelect: (value: "yes" | "no") => void;
}

export default function YesNoSelector({
  selected,
  onSelect,
}: YesNoSelectorProps) {
  return (
    <div className="flex flex-row gap-[9px]">
      <button
        type="button"
        aria-pressed={selected === "yes"}
        onClick={() => onSelect("yes")}
        className="flex-1 h-[129px] rounded-2xl font-medium text-[18px] transition-all"
        style={{
          backgroundColor: selected === "yes" ? "#EEFFFC" : "#F6F7F8",
          color: selected === "yes" ? "#109595" : "#6B7280",
        }}
      >
        예
      </button>
      <button
        type="button"
        aria-pressed={selected === "no"}
        onClick={() => onSelect("no")}
        className="flex-1 h-[129px] rounded-2xl font-medium text-[18px] transition-all"
        style={{
          backgroundColor: selected === "no" ? "#EEFFFC" : "#F6F7F8",
          color: selected === "no" ? "#109595" : "#6B7280",
        }}
      >
        아니요
      </button>
    </div>
  );
}
