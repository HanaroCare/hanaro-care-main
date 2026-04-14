export function ForecastLegend() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-center justify-center gap-2 text-[11px] text-[#9CA3AF]">
        <span className="inline-block h-0.5 w-6 bg-[#9CA3AF]" />
        <span>과거 KB시세 추이 (최근 7년)</span>
      </div>

      <div className="flex items-center justify-center gap-6 text-[11px] text-[#6B7280]">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-hana-green-500" />
          <span>낙관 +4%/년</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-hana-green-600" />
          <span>중립 +2%/년</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-hana-green-900" />
          <span>비관 0%/년</span>
        </div>
      </div>
    </div>
  );
}
