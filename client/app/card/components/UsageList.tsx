import { UsageData } from "../hooks/useCard";

interface UsageListProps {
  usages: UsageData[];
  cardNm: string;
}

export default function UsageList({ usages, cardNm }: UsageListProps) {
  return (
    <div className="flex flex-col gap-6">
      {usages.map((u) => (
        <div key={u.cardUsageId} className="flex justify-between items-start">
          <div>
            <p className="text-base text-[#3E454C]">{u.usageNm}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#3E454C]">{u.createdAt}</span>
              <span className="w-[3px] h-[3px] rounded-full bg-[#5E707C] inline-block" />
              <span className="text-xs text-[#3E454C]">{cardNm}</span>
            </div>
          </div>
          <p className={`text-sm font-medium ${u.abnmlYn === "Y" ? "text-red-500" : "text-[#22262B]"}`}>
            {u.usageAmt.toLocaleString()}원
          </p>
        </div>
      ))}
    </div>
  );
}