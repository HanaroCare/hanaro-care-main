type InfoBoxProps = {
  title: string;
  desc: string | React.ReactNode;
  className?: string;
  bgColor?: string;
  textColor?: string;
};

export default function InfoBox({
  title,
  desc,
  className,
  bgColor = '#EAF8F7',
  textColor = '#0F766E',
}: InfoBoxProps) {
  return (
    <div
      className={`rounded-[28px] px-6 py-6 ${className ?? ''}`}
      style={{ backgroundColor: bgColor }}
    >
      <p
        className="text-[16px] leading-6 font-semibold tracking-tight"
        style={{ color: textColor }}
      >
        {title}
      </p>

      {/* whitespace-pre-line은 유지하되, 내부 요소들이 잘 렌더링되게 합니다 */}
      <div
        className="mt-3 text-[14px] leading-6 font-medium whitespace-pre-line"
        style={{ color: textColor }}
      >
        {desc}
      </div>
    </div>
  );
}
