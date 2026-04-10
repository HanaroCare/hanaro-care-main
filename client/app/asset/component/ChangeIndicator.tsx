/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
'use client';

export function ChangeIndicator() {
  return (
    <div className="inline-flex h-[24px] w-fit items-center rounded-full bg-white px-3">
      <span className="flex items-center gap-1 font-bold text-[11px] text-hana-red-500">
        230만 ( 1.2% )
        <svg
          width="6"
          height="4"
          viewBox="0 0 6 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 0L6 4L0 4L3 0Z" fill="#D60003" />
        </svg>
      </span>
    </div>
  );
}
