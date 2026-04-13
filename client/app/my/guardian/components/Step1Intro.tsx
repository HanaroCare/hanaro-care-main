'use client';

import { HeartPulse, Landmark, Users } from 'lucide-react';
import PrimaryButton from '@/components/PrimaryButton';

type Props = {
  onNext: () => void;
};

const features = [
  {
    icon: Landmark,
    title: '재산 관리',
    desc: '은행 업무, 부동산 관리 등 대리',
    color: 'bg-red-50',
    iconColor: 'text-red-400',
  },
  {
    icon: HeartPulse,
    title: '의료 결정',
    desc: '병원 입원, 수술 동의 등 대리',
    color: 'bg-amber-50',
    iconColor: 'text-amber-400',
  },
  {
    icon: Users,
    title: '생활 지원',
    desc: '요양 시설, 돌봄 서비스 계약 등',
    color: 'bg-blue-50',
    iconColor: 'text-blue-400',
  },
];

export default function Step1Intro({ onNext }: Props) {
  return (
    <div>
      <div className="pt-6 pb-4">
        <div className="mb-6">
          <p className="mb-0.5 font-bold text-[26px] text-hana-green-700 leading-snug">
            임의후견인
          </p>
          <h1 className="mb-3 font-bold text-[26px] text-gray-900 leading-tight">
            <span className="text-hana-green-700">등록</span>을 시작해요
          </h1>
          <p className="text-[14px] text-gray-500 leading-relaxed">
            판단 능력이 저하될 때를 대비해
            <br />
            미리 믿을 수 있는 사람을 후견인으로
            <br />
            지정해두는 제도예요
          </p>
        </div>

        {/* Info box */}
        <div className="mb-8 rounded-2xl bg-teal-50 p-4">
          <p className="mb-1 font-semibold text-[13px] text-hana-green-700">
            임의 후견인이란?
          </p>
          <p className="text-[11px] text-hana-green-700 leading-relaxed">
            치매, 사고 등으로 판단 능력이 떨어졌을 때 재산 관리, 의료 결정, 생활
            지원을 대신해줄 수 있는 사람을 미리 지정하는 법적 제도예요
          </p>
        </div>

        {/* Section title */}
        <p className="mb-4 font-medium text-[13px] text-gray-400">
          등록 후 할 수 있는 것
        </p>

        {/* Feature list */}
        <div className="mb-8 space-y-3">
          {features.map(({ icon: Icon, title, desc, color, iconColor }) => (
            <div key={title} className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-2xl ${color} flex shrink-0 items-center justify-center`}
              >
                <Icon size={22} className={iconColor} />
              </div>
              <div>
                <p className="font-semibold text-[15px] text-gray-800">
                  {title}
                </p>
                <p className="mt-0.5 text-[13px] text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mb-4 flex gap-2 rounded-xl bg-amber-50 px-4 py-3">
          <span className="mt-0.5 shrink-0 text-amber-400 text-base">💡</span>
          <p className="text-[12px] text-amber-700 leading-relaxed">
            법적 효력을 위해 등록 후 공증이 필요해요. H Lounge에서 법무사 연결을
            도와드려요.
          </p>
        </div>
      </div>
      <PrimaryButton
        onClick={onNext}
        className="mb-3"
        fullWidth
        label={'등록하기'}
      />
    </div>
  );
}
