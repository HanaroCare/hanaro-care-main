type TrustInfoBoxProps = {
  title: string;
  desc: string;
  className?: string;
};

export default function TrustInfoBox({
  title,
  desc,
  className,
}: TrustInfoBoxProps) {
  return (
    <div className={`rounded-[28px] bg-[#EFF8F7] px-7 py-7 ${className ?? ""}`}>
      <p className="text-[16px] leading-6 font-semibold tracking-tight text-hana-ez-600">
        {title}
      </p>
      <p className="mt-6 text-[12px] leading-5.5 font-normal tracking-snug text-hana-ez-600">
        {desc}
      </p>
    </div>
  );
}
