import SectionCard from '../trust/SectionCard';

type TrustUsageType = 'hospital' | 'living' | 'both';

export function ExecutionListCard({ type }: { type: TrustUsageType }) {
  // 경우에 따른 아이템 데이터 세트
  const getItems = () => {
    switch (type) {
      case 'hospital':
        return [
          {
            date: '04.12',
            title: '삼성서울병원',
            sub: '병원비 자동 집행',
            price: '-43만원',
          },
          {
            date: '04.10',
            title: '서울대학교병원',
            sub: '병원비 자동 집행',
            price: '-12만원',
          },
          {
            date: '04.05',
            title: '행복약국',
            sub: '의약품 구매',
            price: '-3.5만원',
          },
        ];
      case 'living':
        return [
          {
            date: '04.15',
            title: '현대마트',
            sub: '생활비 자동 지급',
            price: '-25만원',
          },
          {
            date: '04.11',
            title: '관리비 납부',
            sub: '생활비 집행',
            price: '-18만원',
          },
          {
            date: '04.03',
            title: '쿠팡 결제',
            sub: '생활용품 구매',
            price: '-4.2만원',
          },
        ];
      case 'both':
      default:
        return [
          {
            date: '04.12',
            title: '삼성서울병원',
            sub: '병원비 자동 집행',
            price: '-43만원',
          },
          {
            date: '04.10',
            title: '현대마트',
            sub: '생활비 자동 지급',
            price: '-25만원',
          },
          {
            date: '04.05',
            title: '행복약국',
            sub: '의약품 구매',
            price: '-3.5만원',
          },
        ];
    }
  };

  const items = getItems();

  return (
    <SectionCard>
      <p className="mb-4 font-semibold text-[16px] text-[#111827]">사용 내역</p>

      <div className="space-y-5">
        {items.map((item, idx) => (
          <Item
            key={idx}
            date={item.date}
            title={item.title}
            sub={item.sub}
            price={item.price}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function Item({
  date,
  title,
  sub,
  price,
}: {
  date: string;
  title: string;
  sub: string;
  price: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="w-14 text-[13px] text-[#9CA3AF] font-medium">
        {date}
      </span>

      <div className="flex-1 flex flex-col justify-center">
        <p className="text-[14px] text-[#1F2937] font-semibold leading-tight">
          {title}
        </p>
        <p className="text-[12px] text-[#6B7280] mt-1">{sub}</p>
      </div>

      <span className="text-[15px] text-[#EF4444] font-bold">{price}</span>
    </div>
  );
}
