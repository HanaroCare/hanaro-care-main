type InfoBoxProps = {
  title: string;
  desc: string;
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

      <p
        className="mt-3 text-[14px] leading-6 font-medium"
        style={{ color: textColor }}
      >
        {desc}
      </p>
    </div>
  );
}
