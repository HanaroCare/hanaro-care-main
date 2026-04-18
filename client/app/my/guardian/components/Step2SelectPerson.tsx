'use client';

import { useQuery } from '@tanstack/react-query';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { getFamily } from '../../actions/guardianActions';
import type { FamilySummaryDto, GuardianData } from '../types/types';

type Props = {
  data: GuardianData;
  onChange: (data: Partial<GuardianData>) => void;
  onNext: () => void;
};


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
  const {
    data: familyList,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['familyList'],
    queryFn: () => getFamily(),
  });

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
  if (isError) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-400">가족 정보를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 text-hana-ez-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!familyList?.length) {
    return (
      <div className="p-10 text-center text-gray-400">
        등록된 가족 정보가 없어요.
      </div>
    );
  }

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
                  ? 'border-gray-100 bg-hana-green-50'
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
                    {person.relationCd === 'CHILD' ? '자식' : person.relationCd === 'PARENT' ? '부모' : person.relationCd}
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
