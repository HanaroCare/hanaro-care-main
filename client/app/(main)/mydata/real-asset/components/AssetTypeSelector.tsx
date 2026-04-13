"use client";

import type { AssetType } from "../page";

type AssetTypeSelectorProps = {
  currentType: AssetType;
  onSelect: (type: AssetType) => void;
};

/**
 * 부동산, 자동차, 금 중 조회할 자산을 선택하는 탭 셀렉터
 */
export default function AssetTypeSelector({ currentType, onSelect }: AssetTypeSelectorProps) {
  const types: { id: AssetType; label: string }[] = [
    { id: "house", label: "부동산" },
    { id: "car", label: "자동차" },
    { id: "gold", label: "금" },
  ];

  return (
    <div className="flex w-full gap-[0.5rem] p-[0.375rem] bg-gray-100 rounded-[1rem]">
      {types.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => onSelect(type.id)}
          className={`flex-1 py-[0.75rem] text-[0.9375rem] font-bold rounded-[0.75rem] transition-all duration-200 ${
            currentType === type.id
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
