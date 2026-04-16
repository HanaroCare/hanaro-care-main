'use client';

import { Building2, Home, Hospital, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CareMethodCard } from './CareMethodCard';

type CareMethod = {
  id: string;
  title: string;
  subtitle: string;
  Icon: React.ElementType;
};

const CARE_METHODS: CareMethod[] = [
  {
    id: 'home-care',
    title: '재가요양',
    subtitle: '살던 집에서 받는 돌봄',
    Icon: Home,
  },
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
    id: 'premium',
    title: '프리미엄 요양시설',
    subtitle: '하나은행 운영 프리미엄 시설',
    Icon: Star,
  },
];

type CareMethodSelectorProps = {
  value?: string;
  onChange?: (id: string) => void;
};

export function CareMethodSelector({ value, onChange }: CareMethodSelectorProps) {
  const [selectedId, setSelectedId] = useState<string>(value || 'home-care');

  useEffect(() => {
    if (value !== undefined) {
      setSelectedId(value);
    }
  }, [value]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onChange?.(id);
  };

  return (
    <div className="flex w-81.25 flex-col gap-2.5">
      {CARE_METHODS.map((method) => (
        <CareMethodCard
          key={method.id}
          title={method.title}
          subtitle={method.subtitle}
          Icon={method.Icon}
          isSelected={selectedId === method.id}
          onClick={() => handleSelect(method.id)}
        />
      ))}
    </div>
  );
}
