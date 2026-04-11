'use client';

type AssetSummaryHeaderProps = {
  totalAmount: string;
};

export function AssetSummaryHeader({ totalAmount }: AssetSummaryHeaderProps) {
  return (
    <div className="w-full bg-white px-6 py-8">
      <div className="flex flex-col">
        <span className="font-normal text-[13px] text-hana-black-500">
          총 금융자산
        </span>
        <h1 className="mt-1 font-semibold text-[30px] text-hana-black-900 leading-tight">
          {totalAmount}
        </h1>
      </div>
    </div>
  );
}
