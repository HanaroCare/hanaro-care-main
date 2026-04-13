'use client';

import PrimaryButton from '@/components/baseelements/PrimaryButton';
import type { GuardianData } from '../types/types';

type Props = {
  data: GuardianData;
  onChange: (data: Partial<GuardianData>) => void;
  onNext: () => void;
};

const family = [
  { id: '1', name: '김영웅', relationship: '자녀', phone: '010-1234-5678' },
  { id: '2', name: '김유연', relationship: '자녀', phone: '010-1234-5678' },
];

const relationships = ['배우자', '자녀', '형제·자매', '지인', '기타'];

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hana-ez-50">
      <span className="font-bold text-4 text-hana-ez-600">
        {name.charAt(0)}
      </span>
    </div>
  );
}

export default function Step2SelectPerson({ data, onChange, onNext }: Props) {
  return (
    <div>
      <div className="flex flex-col pt-6 pb-4">
        <div className="mt-4 mb-7 h-0.5 bg-gray-100">
          <div className="-translate-y-1/2 top-1/2 h-1 w-20 bg-hana-green-700" />
        </div>
        <div className="mb-8">
          <h1 className="mb-1 font-bold text-[24px] text-gray-900 leading-snug">
            후견인으로 지정할
            <br />
            사람을 입력해주세요
          </h1>
          <p className="mt-2 text-[13px] text-gray-400">
            등록된 가족 중에서 선택해주세요
          </p>
        </div>

        {/* Family list */}
        <p className="mb-3 font-medium text-[13px] text-gray-500">가족 목록</p>
        <div className="mb-8 space-y-2">
          {family.map((person) => (
            <button
              type="button"
              key={person.id}
              onClick={() => onChange({ selectedPerson: person.id })}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-4 transition-all ${
                data.selectedPerson === person.id
                  ? 'border-hana-ez-600 bg-gray-50'
                  : 'border-gray-100 hover:bg-gray-100'
              }`}
            >
              <Avatar name={person.name} />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[15px] text-gray-800">
                    {person.name}
                  </span>
                  <span className="rounded-full bg-[#EBFFFC] px-2 py-0.5 font-medium text-[11px] text-hana-ez-600">
                    {person.relationship}
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] text-gray-500">
                  {person.phone}
                </p>
              </div>
              {data.selectedPerson === person.id && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-hana-ez-600">
                  <div className="h-2.5 w-2.5 rounded-full bg-hana-ez-600" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Relationship */}
        <p className="mb-3 font-medium text-[13px] text-gray-500">
          후견인 관계
        </p>
        <div className="mb-auto flex flex-wrap gap-2">
          {relationships.map((rel) => (
            <button
              type="button"
              key={rel}
              onClick={() => onChange({ relationship: rel })}
              className={`rounded-full px-4 py-2 font-medium text-[13px] transition-all ${
                data.relationship === rel
                  ? 'bg-hana-ez-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {rel}
            </button>
          ))}
        </div>
      </div>
      <PrimaryButton
        onClick={onNext}
        disabled={!data.selectedPerson}
        className="mt-15 w-full"
        label={'다음'}
      />{' '}
    </div>
  );
}
