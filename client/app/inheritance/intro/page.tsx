import InheritanceIntroClient from './InheritanceIntroClient';

const SLIDES = [
  {
    idx: 0,
    image: '/images/inheritance/intro-slide-1.png',
    title: '상속 설계란?',
    description: '내 자산을 기반으로\n법적으로 안전한 상속 계획을 세워드려요',
  },
  {
    idx: 1,
    image: '/images/inheritance/intro-slide-2.png',
    title: '법정상속분 vs 유류분',
    description:
      '두가지 기준을 한눈에 비교하고\n내 설계가 법적으로 안전한지 확인해요',
  },
  {
    idx: 2,
    image: '/images/inheritance/intro-slide-3.png',
    title: '가족을 위한 나만의 상속설계',
    description:
      '유언대용신탁을 통해 법적 효력을 갖추고\n소중한 분들에게 마음을 전해요',
  },
];

export default function InheritanceIntroPage() {
  return <InheritanceIntroClient slides={SLIDES} />;
}
