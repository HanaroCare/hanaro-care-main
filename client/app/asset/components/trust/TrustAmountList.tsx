type AmountItem = {
  id: string;
  title: string;
  amount: string;
};

type TrustAmountListProps = {
  items: AmountItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  totalLabel: string;
  formattedTotal: string;
  className?: string;
};

/**
 * 금액 항목 다중 선택 리스트 + 합계 카드
 * select-assets / payout-use에서 공통으로 사용
 */
export default function TrustAmountList({
  items,
  selected,
  onToggle,
  totalLabel,
  formattedTotal,
  className = "",
}: TrustAmountListProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const isSelected = selected.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              aria-pressed={isSelected}
              className={`flex min-h-25 w-full items-center justify-between rounded-[24px] px-6 py-7 text-left shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition ${
                isSelected
                  ? "border border-hana-ez-600 bg-[#EFFFFD]"
                  : "border border-[#F2F3F5] bg-white"
              }`}
            >
              <p className="font-semibold text-[16px] text-[#1F2937] leading-6 tracking-tight">
                {item.title}
              </p>
              <p
                className={`font-medium text-[16px] leading-6 tracking-tight ${
                  isSelected ? "text-hana-ez-600" : "text-[#1F2937]"
                }`}
              >
                {item.amount}
              </p>
            </button>
          );
        })}
      </div>

      {selected.size > 0 && (
        <div className="mt-8 rounded-[24px] bg-[#EFF8F7] px-6 py-8">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[16px] text-hana-ez-600 leading-6 tracking-tight">
              {totalLabel}
            </span>
            <span className="font-bold text-[22px] text-hana-ez-600 leading-8 tracking-tight">
              {formattedTotal}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
