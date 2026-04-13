'use client';

import { FileText, HeartPulse, Home, Landmark, Shield } from 'lucide-react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import type { GuardianData } from '../types/types';

type Props = {
  data: GuardianData;
  onChange: (data: Partial<GuardianData>) => void;
  onNext: () => void;
};
const permissions = [
  {
    id: '재산관리',
    icon: Landmark,
    title: '재산 관리',
    desc: '은행, 부동산, 투자 업무 대리',
    color: 'bg-red-50',
    iconColor: 'text-red-400',
  },
  {
    id: '의료결정',
    icon: HeartPulse,
    title: '의료 결정',
    desc: '입원·수술·치료 방법 결정 대리',
    color: 'bg-amber-50',
    iconColor: 'text-amber-400',
  },
  {
    id: '요양시설계약',
    icon: Home,
    title: '요양 시설 계약',
    desc: '요양원·복지시설 입소 계약',
    color: 'bg-blue-50',
    iconColor: 'text-blue-400',
  },
  {
    id: '계약체결',
    icon: FileText,
    title: '계약 체결',
    desc: '각종 서비스·물품 구매 계약',
    color: 'bg-purple-50',
    iconColor: 'text-purple-400',
  },
  {
    id: '법적대리',
    icon: Shield,
    title: '법적 대리',
    desc: '소송, 행정 업무 법적 대리',
    color: 'bg-gray-100',
    iconColor: 'text-gray-500',
  },
];

export default function Step3SelectPermissions({
  data,
  onChange,
  onNext,
}: Props) {
  const toggle = (id: string) => {
    const current = data.permissions;
    const next = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    onChange({ permissions: next });
  };

  return (
    <div>
      <div className="pt-6 pb-4">
        <div className="mt-3 mb-8 h-0.5 bg-gray-100">
          <div className="-translate-y-1/2 top-1/2 h-1 w-40 bg-hana-green-700" />
        </div>
        <div className="mb-2">
          <h1 className="mb-2 font-bold text-[24px] text-gray-900 leading-snug">
            후견인에게 어떤
            <br />
            권한을 줄까요?
          </h1>
          <p className="text-[13px] text-gray-400 leading-relaxed">
            필요한 항목만 선택해도 돼요.
            <br />
            나중에 변경할 수 있어요
          </p>
        </div>

        {/* Permission list */}
        <div className="mt-6 space-y-3">
          {permissions.map(
            ({ id, icon: Icon, title, desc, color, iconColor }) => {
              const selected = data.permissions.includes(id);
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => toggle(id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 transition-all ${
                    selected
                      ? 'border-hana-ez-600 bg-teal-50'
                      : 'border-gray-200 hover:bg-[#F9FAFB]'
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-2xl ${color} flex shrink-0 items-center justify-center`}
                  >
                    <Icon size={22} className={iconColor} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-[15px] text-gray-800">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-gray-500">{desc}</p>
                  </div>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                      selected
                        ? 'border-teal-500 bg-teal-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selected && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            },
          )}
        </div>
      </div>
      <PrimaryButton onClick={onNext} className="mb-5 w-full" label={'다음'} />
    </div>
  );
}
