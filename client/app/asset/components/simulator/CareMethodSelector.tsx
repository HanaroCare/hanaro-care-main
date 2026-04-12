'use client';

import { Building2, Home, Hospital } from 'lucide-react';
import { useState } from 'react';
import { CareMethodCard } from './CareMethodCard';

type CareMethod = {
  id: string;
  title: string;
  subtitle: string;
  Icon: React.ElementType;
};

const CARE_METHODS: CareMethod[] = [
  {
    id: 'nursing-home',
    title: '요양원',
    subtitle: '전문 돌봄 시설 입소',
    Icon: Building2,
  },
  {
    id: 'nursing-hospital',
    title: '요양병원',
    subtitle: '의료와 돌봄을 동시에',
    Icon: Hospital,
  },
  {
    id: 'home-care',
    title: '재가요양',
    subtitle: '살던 집에서 받는 돌봄',
    Icon: Home,
  },
];

export function CareMethodSelector() {
  const [selectedId, setSelectedId] = useState<string>('nursing-home');

  return (
    <div className="flex w-81.25 flex-col gap-2.5">
      {CARE_METHODS.map((method) => (
        <CareMethodCard
          key={method.id}
          title={method.title}
          subtitle={method.subtitle}
          Icon={method.Icon}
          isSelected={selectedId === method.id}
          onClick={() => setSelectedId(method.id)}
        />
      ))}
    </div>
  );
}
