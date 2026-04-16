import Image from 'next/image';

// 1. 매핑 테이블 정의 (배열/객체 형태)
const LOGO_MAP: Record<string, string> = {
  하나생명: '/hana.svg',
  현대해상: '/hyundae.svg',
  삼성생명: '/samsung.svg',
  // 추가 보험사가 생기면 여기에 한 줄만 추가하세요.
};

export default function InsuranceLogo({ img }: { img: string }) {
  // 2. 입력값(img)이 포함된 키가 있는지 확인
  // name.includes(key) 방식으로 찾으면 '하나생명보험' 등 미세하게 다른 이름도 대응 가능합니다.
  const matchedKey = Object.keys(LOGO_MAP).find((key) => img.includes(key));
  const logoSrc = matchedKey
    ? '/images/my/insurance' + LOGO_MAP[matchedKey]
    : null;

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-teal-50">
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt={img}
          width={24}
          height={24}
          className="object-contain"
        />
      ) : (
        /* 기본 SVG (제공해주신 디자인) */
        <svg
          aria-hidden="true"
          viewBox="0 0 32 32"
          className="h-6 w-6"
          fill="none"
        >
          <circle cx="16" cy="16" r="14" fill="#0CB8B6" opacity="0.15" />
          <path
            d="M10 22 C10 16, 16 10, 22 10"
            stroke="#0CB8B6"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M10 22 L16 16 L22 10"
            stroke="#0CB8B6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
    </div>
  );
}
