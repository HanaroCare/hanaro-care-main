import { formatKoreanCurrency } from '../../utils/formatCurrency';
import SectionCard from '../trust/SectionCard';

type Props = {
  principalAmount?: number;
  executionAmount?: number;
  profit?: number;
  currentAmount?: number;
};

export function AssetDetailCard({
  principalAmount,
  executionAmount,
  profit,
  currentAmount,
}: Props) {
  return (
    <SectionCard>
      <p className="mb-4 font-semibold">상세 내역</p>

      <div className="space-y-3 text-sm">
        <Row
          label="원금"
          value={principalAmount ? formatKoreanCurrency(principalAmount) : '-'}
        />

        <Row
          label="누적 사용 금액"
          value={
            executionAmount ? `-${formatKoreanCurrency(executionAmount)}` : '-'
          }
          red
        />

        <Row
          label="누적 수익"
          value={profit ? `+${formatKoreanCurrency(profit)}` : '-'}
          green
        />
      </div>

      <div className="my-4 h-px bg-[#F2F3F5]" />

      <Row
        label="실 수령액"
        value={currentAmount ? formatKoreanCurrency(currentAmount) : '-'}
        highlight
      />
    </SectionCard>
  );
}

type RowProps = {
  label: string;
  value: string;
  red?: boolean;
  green?: boolean;
  highlight?: boolean;
};

function Row({
  label,
  value,
  red = false,
  green = false,
  highlight = false,
}: RowProps) {
  return (
    <div className="flex justify-between">
      <span className="text-[#6A7282]">{label}</span>
      <span
        className={`
          ${red ? 'text-red-500' : ''}
          ${green ? 'text-hana-ez-600' : ''}
          ${highlight ? 'font-bold text-hana-ez-600' : ''}
        `}
      >
        {value}
      </span>
    </div>
  );
}
