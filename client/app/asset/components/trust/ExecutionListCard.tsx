import { formatKoreanCurrency } from '../../utils/formatCurrency';
import SectionCard from '../trust/SectionCard';

type TrustUsageType = 'hospital' | 'living' | 'both';

type Props = {
  type: TrustUsageType;
  hospitalAmount?: number;
  livingAmount?: number;
};

type MonthlyItem = {
  month: string;
  title: string;
  amount: number;
};

function getRecentMonths(count: number) {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}.${month}`;
  });
}

export function ExecutionListCard({
  type,
  hospitalAmount,
  livingAmount,
}: Props) {
  const months = getRecentMonths(3);

  const items: MonthlyItem[] = months.flatMap((month) => {
    const monthItems: MonthlyItem[] = [];

    if ((type === 'hospital' || type === 'both') && (hospitalAmount ?? 0) > 0) {
      monthItems.push({
        month,
        title: '병원비 자동 집행',
        amount: hospitalAmount ?? 0,
      });
    }

    if ((type === 'living' || type === 'both') && (livingAmount ?? 0) > 0) {
      monthItems.push({
        month,
        title: '생활비 자동 집행',
        amount: livingAmount ?? 0,
      });
    }

    return monthItems;
  });

  return (
    <SectionCard>
      <p className="mb-4 text-[16px] font-semibold text-[#111827]">
        설정 집행 내역
      </p>

      <div className="space-y-5">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <Item
              key={`${item.month}-${item.title}-${idx}`}
              month={item.month}
              title={item.title}
              amount={item.amount}
            />
          ))
        ) : (
          <p className="text-[14px] text-[#9CA3AF]">
            설정된 월 집행 항목이 없어요.
          </p>
        )}
      </div>
    </SectionCard>
  );
}

function Item({
  month,
  title,
  amount,
}: {
  month: string;
  title: string;
  amount: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="w-16 text-[13px] font-medium text-[#9CA3AF]">
        {month}
      </span>

      <div className="flex-1">
        <p className="text-[14px] font-semibold leading-tight text-[#1F2937]">
          {title}
        </p>
        <p className="mt-1 text-[12px] text-[#6B7280]">매월 자동 집행</p>
      </div>

      <span className="text-[15px] font-bold text-[#EF4444]">
        -{formatKoreanCurrency(amount)}
      </span>
    </div>
  );
}
