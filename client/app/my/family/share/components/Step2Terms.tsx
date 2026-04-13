'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

export default function Step2Terms({ onNext }: { onNext: () => void }) {
  const [allAgreed, setAllAgreed] = useState(false);
  // 개별 약관 동의 상태 관리
  const [agreements, setAgreements] = useState({
    personal: false,
    thirdParty: false,
    uniqueId: false,
    sensitive: false,
  });

  // 전체 동의 클릭 시 로직
  const handleAllAgreeChange = () => {
    const nextValue = !allAgreed;
    setAllAgreed(nextValue);
    // 모든 개별 약관 상태를 전체 동의 상태와 동일하게 변경
    setAgreements({
      personal: nextValue,
      thirdParty: nextValue,
      uniqueId: nextValue,
      sensitive: nextValue,
    });
  };

  // 개별 약관 클릭 시 로직
  const handleAgreementChange = (key: keyof typeof agreements) => {
    const nextAgreements = { ...agreements, [key]: !agreements[key] };
    setAgreements(nextAgreements);
    // 모든 개별 약관이 동의되었는지 확인하여 전체 동의 상태 업데이트
    setAllAgreed(Object.values(nextAgreements).every(Boolean));
  };

  // 약관 목록 데이터
  const terms = [
    { key: 'personal', text: '개인정보 수집 및 이용 동의' },
    { key: 'thirdParty', text: '제3자 정보 제공 동의' },
    { key: 'uniqueId', text: '고유식별정보 처리 동의' },
    { key: 'sensitive', text: '민감정보 처리 동의' },
  ];

  // 모든 필수 약관 동의 여부 확인 (버튼 활성화용)
  const canContinue = Object.values(agreements).every(Boolean);

  return (
    // 전체 컨테이너 패딩 조정 (스크린샷에 맞춰)
    <div className="flex h-full flex-col px-6 pt-12 pb-10">
      <h2 className="mb-3 font-semibold text-[#1A1A1A] text-[24px] leading-[1.45] tracking-tight">
        서비스 이용을 위해
        <br />
        동의가 필요해요
      </h2>
      <p className="mb-10 text-[#6A7282] text-[13px]">
        아래 항목을 확인하고 동의해주세요
      </p>

      <div className="flex-1 space-y-8">
        {/* 전체 동의 박스 - 디자인 수정 */}
        <button
          type="button"
          onClick={handleAllAgreeChange}
          aria-pressed={allAgreed}
          // 배경색, 테두리, 모서리 둥글기 수정
          className={`flex w-full cursor-pointer items-center gap-4 rounded-[16px] border bg-[#F5F6F8] p-6 transition-all ${
            allAgreed ? 'border-[#008485]' : 'border-gray-200'
          }`}
        >
          {/* 체크박스 - 위치 왼쪽으로 이동, 모양 사각형으로 변경 */}
          <div
            aria-hidden="true"
            // rounded-full -> rounded-[6px]로 사각형 모양
            className={`flex h-[22px] w-[22px] items-center justify-center rounded-[6px] border-2 transition-colors ${
              allAgreed
                ? 'border-[#008485] bg-[#008485]'
                : 'border-[#DDE1E6] bg-white'
            }`}
          >
            {allAgreed && <Check className="h-4 w-4 text-white" />}
          </div>
          {/* 텍스트 스타일 수정 */}
          <span
            className={`font-semibold text-[17px] ${allAgreed ? 'text-[#008485]' : 'text-[#1A1A1A]'}`}
          >
            전체 동의
          </span>
        </button>

        {/* 개별 약관 목록 - 디자인 수정 */}
        <div
          className="space-y-5 px-2"
          role="group"
          aria-label="상세 약관 동의 항목"
        >
          {terms.map(({ key, text }) => (
            <div key={key} className="group flex items-center gap-3">
              {/* 체크박스 - 모양 사각형으로 변경 */}
              <button
                type="button"
                onClick={() =>
                  handleAgreementChange(key as keyof typeof agreements)
                }
                aria-pressed={agreements[key as keyof typeof agreements]}
                // rounded-full -> rounded-[6px]로 사각형 모양
                className={`flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-[6px] border-2 transition-colors ${
                  agreements[key as keyof typeof agreements]
                    ? 'border-[#008485] bg-[#008485]'
                    : 'border-[#DDE1E6] bg-white'
                }`}
              >
                {agreements[key as keyof typeof agreements] && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </button>

              {/* [필수] 태그 및 텍스트 컨테이너 */}
              <div className="flex flex-1 items-center gap-1.5">
                {/* [필수] 태그 추가 */}
                <span className="whitespace-nowrap rounded-full bg-[#E6F3F3] px-2.5 py-0.5 font-medium text-[#008485] text-[10px]">
                  필수
                </span>
                {/* 텍스트 스타일 수정 */}
                <span className="text-[#1F2937] text-[15px]">{text}</span>
              </div>

              {/* 스크린샷에는 없지만 보통 약관 보기가 있으므로 추가 고려 */}
              {/* <ChevronRight className="w-5 h-5 text-gray-400" /> */}
            </div>
          ))}
        </div>
      </div>

      {/* 다음 버튼 - 스크린샷 디자인 반영 및 하단 고정 */}
      <div className="mt-auto pt-8 pb-6">
        <button
          onClick={onNext}
          disabled={!canContinue}
          // 스크린샷의 넓고 둥근 사각형 모양 버튼 직접 구현
          className={`w-full rounded-[16px] py-4 font-semibold text-[17px] transition-colors ${
            canContinue
              ? 'bg-[#008485] text-white'
              : 'bg-[#E8EBF0] text-[#6A7282]'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
