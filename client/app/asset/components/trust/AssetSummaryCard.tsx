import { formatKoreanCurrency } from '../../utils/formatCurrency';

type Props = {
  currentAmount?: number;
  profitRate?: number;
};

export function AssetSummaryCard({ currentAmount, profitRate }: Props) {
  return (
    <div className="rounded-[24px] bg-linear-to-br from-hana-teal-600 to-hana-teal-300 px-6 py-7">
      <p className="mt-1 text-[28px] font-bold leading-[1.3] tracking-tight text-white">
        현 자산 {currentAmount ? formatKoreanCurrency(currentAmount) : '-'}
      </p>

      <p className="mt-2 text-[14px] font-semibold leading-5">
        <span className="text-white">원금 대비 </span>
        <span className="text-hana-red-500">
          {profitRate ? `+${profitRate}%` : '-'}
        </span>
      </p>
    </div>
  );
}
