'use client';

import { useQuery } from '@tanstack/react-query';
import { myhanaApi } from '@/app/my/api/myApi';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import type { FamilySummaryDto, GuardianData } from '../types/types';

type Props = {
  data: GuardianData;
  onChange: (data: Partial<GuardianData>) => void;
  onNext: () => void;
};

const relationships = ['배우자', '자녀', '부모', '가족', '기타'];

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hana-ez-50">
      <span className="font-bold text-4 text-hana-ez-600">
        {name ? name.charAt(0) : ''}
      </span>
    </div>
  );
}

export default function Step2SelectPerson({ data, onChange, onNext }: Props) {
  // 1. 백엔드에서 가족 목록 가져오기
  const { data: familyList, isLoading } = useQuery({
    queryKey: ['familyList'],
    queryFn: () => myhanaApi.getFamily(),
  });

  // 2. 가족 선택 시 실행될 함수 (컴포넌트 내부에 위치)
  const handleSelect = (person: FamilySummaryDto) => {
    onChange({
      selectedPerson: person,
      relationship: person.relationCd,
    });
  };

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-400">
        가족 정보를 불러오는 중...
      </div>
    );

  return (
    <div>
      <div className="flex flex-col pt-6 pb-4">
        {/* 프로그래스 바 (디자인 유지) */}
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

        {/* 가족 목록 섹션 */}
        <p className="mb-3 font-medium text-[13px] text-gray-500">가족 목록</p>
        <div className="mb-8 space-y-2">
          {familyList?.map((person) => (
            <button
              type="button"
              key={person.phoneNumber} // 고유값인 전화번호를 키로 사용
              onClick={() => handleSelect(person)} // 여기서 위에서 만든 함수 실행!
              className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-4 transition-all ${
                data.selectedPerson?.phoneNumber === person.phoneNumber
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
                    {person.relationCd}
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] text-gray-500">
                  {person.phoneNumber}
                </p>
              </div>

              {/* 선택된 상태 표시 (체크 아이콘) */}
              {data.selectedPerson?.phoneNumber === person.phoneNumber && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-hana-ez-600">
                  <div className="h-2.5 w-2.5 rounded-full bg-hana-ez-600" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 후견인 관계 선택 (추가 수정이 필요할 때 사용) */}
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
      />
    </div>
  );
}
