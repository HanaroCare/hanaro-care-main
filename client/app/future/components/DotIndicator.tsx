interface DotIndicatorProps {
  total: number;
  current: number; // 1-based
}

export default function DotIndicator({ total, current }: DotIndicatorProps) {
  return (
    <div className="flex flex-row items-center gap-[7px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="w-[8px] h-[8px] rounded-full"
          style={{
            background:
              i + 1 === current
                ? 'radial-gradient(50% 50% at 50% 50%, #008485 0%, rgba(0,132,133,0.6) 100%)'
                : 'radial-gradient(50% 50% at 50% 50%, #B5B5B5 0%, rgba(181,181,181,0.6) 100%)',
          }}
        />
      ))}
    </div>
  );
}