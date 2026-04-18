import { UsageData } from "../hooks/useCard";

interface UsageListProps {
  usages: UsageData[];
  cardNm: string;
}

function formatTimeOnly(dateStr: string) {
  const date = new Date(dateStr);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function UsageList({ usages, cardNm }: UsageListProps) {
  return (
      <div className="flex flex-col gap-6">
        {usages.map((u) => (
            <div key={u.cardUsageId} className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[17px] font-semibold text-hana-black-800 truncate">
                  {u.usageNm}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-hana-black-500 shrink-0">
                {formatTimeOnly(u.createdAt)}
              </span>
                  <span className="w-[3px] h-[3px] rounded-full bg-hana-black-500 shrink-0" />
                  <span className="text-xs text-hana-black-500 truncate">
                {cardNm}
              </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className={`text-base font-semibold whitespace-nowrap ${
                    u.abnmlYn === "Y" ? "text-hana-red-500" : "text-hana-black-900"
                }`}>
                  {u.usageAmt.toLocaleString()}원
                </p>
              </div>
            </div>
        ))}
      </div>
  );
}