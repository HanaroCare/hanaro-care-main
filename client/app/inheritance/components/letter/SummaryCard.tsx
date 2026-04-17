'use client';

export default function SummaryCard({
  totalAsset,
  totalPercentage,
}: {
  totalAsset: number;
  totalPercentage: number;
}) {
  return (
    <div style={{ padding: 16, border: '1px solid #eee' }}>
      <div>전체 자산: {totalAsset}억원</div>
      <div>비율 합계: {totalPercentage}% / 100%</div>
    </div>
  );
}
