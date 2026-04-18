'use client';

import { Check, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import BottomSheet from '@/components/modules/BottomSheet';
import TermsModal from '@/app/(main)/mydata/components/TermsModal';

const CONSENT_ITEMS = [
  {
    id: 'personal',
    label: '개인정보 수집·이용 동의',
    required: true,
    termsTitle: '개인정보 수집·이용 동의',
    termsContent: `수집·이용 목적: 보험 상품 비교 및 추천 서비스 제공\n\n수집·이용 항목: 성명, 생년월일, 성별, 연락처, 보험 가입 이력, 의료비 지출 내역\n\n보유·이용 기간: 서비스 이용 종료 후 5년\n\n위 개인정보 수집·이용에 동의하지 않으실 수 있으나, 동의 거부 시 서비스 이용이 제한됩니다.`,
  },
  {
    id: 'third-party',
    label: '개인정보 제3자 제공 동의',
    required: true,
    termsTitle: '개인정보 제3자 제공 동의',
    termsContent: `제공받는 자: 하나생명보험, 하나손해보험\n\n제공 목적: 보험 상품 안내 및 가입 처리\n\n제공 항목: 성명, 생년월일, 성별, 연락처\n\n보유·이용 기간: 제공 목적 달성 후 즉시 파기\n\n위 개인정보 제3자 제공에 동의하지 않으실 수 있으나, 동의 거부 시 서비스 이용이 제한됩니다.`,
  },
  {
    id: 'id-info',
    label: '고유식별정보 처리 동의',
    required: true,
    termsTitle: '고유식별정보 처리 동의',
    termsContent: `처리 목적: 본인 확인 및 보험 계약 체결\n\n처리 항목: 주민등록번호\n\n보유·이용 기간: 서비스 이용 종료 후 5년\n\n고유식별정보 처리에 동의하지 않으실 수 있으나, 동의 거부 시 서비스 이용이 제한됩니다.`,
  },
  {
    id: 'sensitive-info',
    label: '민감정보 처리에 관한 동의',
    required: true,
    termsTitle: '민감정보 처리에 관한 동의',
    termsContent: `처리 목적: 보험료 산출 및 보험 상품 추천\n\n처리 항목: 건강 정보, 질병·상해 이력, 의료비 지출 내역\n\n보유·이용 기간: 서비스 이용 종료 후 5년\n\n민감정보 처리에 동의하지 않으실 수 있으나, 동의 거부 시 서비스 이용이 제한됩니다.`,
  },
] as const;

type ConsentBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConsentBottomSheet({
  isOpen,
  onClose,
  onConfirm,
}: ConsentBottomSheetProps) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [termsModal, setTermsModal] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const isAllChecked = checkedIds.length === CONSENT_ITEMS.length;
  const isRequiredChecked = CONSENT_ITEMS.every((item) =>
    checkedIds.includes(item.id),
  );

  const handleToggleAll = () => {
    setCheckedIds(isAllChecked ? [] : CONSENT_ITEMS.map((item) => item.id));
  };

  const handleToggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h2 className="font-bold text-[20px] text-hana-black-900 leading-tight">
            병원비를 줄여받으려면
            <br />
            동의가 필요해요
          </h2>
        </header>

        <div className="flex flex-col border-hana-silver-100 border-t pt-2">
          <ConsentRow
            isBold
            label="전체 동의하기"
            checked={isAllChecked}
            onClick={handleToggleAll}
            isCircle
          />

          <div className="flex flex-col gap-1">
            {CONSENT_ITEMS.map((item) => (
              <ConsentRow
                key={item.id}
                label={item.label}
                required={item.required}
                checked={checkedIds.includes(item.id)}
                onClick={() => handleToggleItem(item.id)}
                showDetail
                onDetail={() =>
                  setTermsModal({
                    title: item.termsTitle,
                    content: item.termsContent,
                  })
                }
              />
            ))}
          </div>
        </div>

        <footer className="flex flex-col gap-4">
          <PrimaryButton
            label="동의하고 시작하기"
            disabled={!isRequiredChecked}
            onClick={onConfirm}
          />
          <button
            type="button"
            onClick={onClose}
            className="text-center font-medium text-[14px] text-hana-black-400 underline underline-offset-4"
          >
            닫기
          </button>
        </footer>
      </div>
      <TermsModal
        isOpen={termsModal !== null}
        onClose={() => setTermsModal(null)}
        title={termsModal?.title ?? ''}
        content={termsModal?.content ?? ''}
      />
    </BottomSheet>
  );
}

function ConsentRow({
                      label,
                      checked,
                      onClick,
                      required,
                      isBold,
                      isCircle,
                      showDetail,
                      onDetail,
                    }: {
  label: string;
  checked: boolean;
  onClick: () => void;
  required?: boolean;
  isBold?: boolean;
  isCircle?: boolean;
  showDetail?: boolean;
  onDetail?: () => void;
}) {
  return (
      // justify-between을 유지하면서 영역을 확실히 나눕니다.
      <div className="group flex items-center py-1">
        {/* 1. 왼쪽: 체크박스 + 텍스트 (클릭 시 체크 토글) */}
        <button
            type="button"
            onClick={onClick}
            className="flex flex-1 items-center gap-3 py-3 text-left"
        >
          <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 transition-all ${
                  isCircle ? 'rounded-full' : 'rounded-[6px]'
              } ${checked ? 'border-hana-green-700 bg-hana-green-700' : 'border-hana-silver-200 bg-white'}`}
          >
            <Check
                size={16}
                className={checked ? 'text-white' : 'text-hana-silver-200'}
            />
          </div>
          <div className="flex items-center gap-1">
            {required && (
                <span className="font-semibold text-[14px] text-hana-green-700">
              [필수]
            </span>
            )}
            <span
                className={`text-[16px] ${isBold ? 'font-bold' : 'font-medium'} text-hana-black-600`}
            >
            {label}
          </span>
          </div>
        </button>

        {/* 2. 오른쪽: 상세 보기 버튼 (클릭 시 모달 오픈) */}
        {showDetail && (
            <button
                type="button"
                onClick={(e) => {
                  e.preventDefault(); // 추가
                  e.stopPropagation();
                  onDetail?.();
                }}
                // p-3으로 클릭 반경을 40px 이상 확보하고, z-index로 위로 올림
                className="relative z-20 flex h-12 w-12 items-center justify-center p-3 text-hana-black-200 hover:text-hana-black-400"
                aria-label={`${label} 상세 보기`}
            >
              <ChevronRight size={20} />
            </button>
        )}
      </div>
  );
}
