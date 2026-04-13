type TrustInfoBoxProps = {
  title?: string;
  desc: string;
  className?: string;
};

export default function InfoBox({ title, desc, className }: TrustInfoBoxProps) {
  return (
    <div
      className={`whitespace-pre-line rounded-[28px] bg-[#EFF8F7] px-7 py-7 ${className ?? ''}`}
    >
      <p className="font-semibold text-[16px] text-hana-ez-600 leading-6 tracking-tight">
        {title}
      </p>
      <p
        className={`${title ? 'mt-6' : ''} font-normal text-[12px] text-hana-ez-600 leading-5.5 tracking-snug`}
      >
        {desc}
      </p>
    </div>
  );
}
