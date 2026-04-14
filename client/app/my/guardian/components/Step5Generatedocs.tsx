'use client';

import { FileText, Upload } from 'lucide-react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { AlertBanner } from '@/components/modules/AlertBanner';
import type { GuardianData } from '../types/types';

type Props = {
  data: GuardianData;
  onNext: () => void;
  goTo: (step: number) => void;
};

const isUser = false; // TODO: 하나로 인증서 여부에 따라 true/false 변경
const familyMap: Record<string, string> = {
  '1': '김영웅',
  '2': '김유연',
};

export default function Step5GenerateDocs({ data, onNext, goTo }: Props) {
  const guardianName = data.selectedPerson
    ? familyMap[data.selectedPerson]
    : '-';
  const permissionLabel = data.permissions.join(', ');
  return (
    <div>
      <div className="pt-6 pb-4">
        <div className="mb-6">
          <h1 className="font-bold text-[24px] text-gray-900 leading-snug">
            계약서 &amp; 신청서를
            <br />
            생성해드릴게요
          </h1>
          <p className="mt-2 text-[13px] text-gray-400">
            입력하신 정보를 바탕으로 PDF를 자동으로 만들어드려요
          </p>
        </div>

        {/* Summary card */}
        <div className="mb-6 rounded-2xl bg-gray-50 p-4">
          <p className="mb-3 font-medium text-[13px] text-gray-500">
            등록 정보 요약
          </p>
          <div className="space-y-2">
            {[
              {
                label: '후견인',
                value: `${guardianName} (${data.relationship})`,
                accent: false,
              },
              {
                label: '권한 범위',
                value: permissionLabel || '-',
                accent: true,
              },
              { label: '본인', value: '권하나', accent: false },
              { label: '등록일', value: '2026.04.07', accent: false },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                className="flex items-start justify-between gap-2"
              >
                <span className="shrink-0 text-[13px] text-gray-500">
                  {label}
                </span>
                <span
                  className={`wrap-break-word text-right font-medium text-[13px] ${
                    accent ? 'text-hana-ez-600' : 'text-gray-800'
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <p className="mb-3 font-medium text-[13px] text-gray-500">
          생성할 서류
        </p>
        <div className="mb-6 space-y-3">
          {/* Doc 1 */}
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0F7F4]">
              <FileText size={18} className="text-teal-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-[14px] text-gray-800">
                임의후견계약서 초안
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                계약서_권하나_2060408.pdf
              </p>
            </div>
            <span className="rounded-full bg-gray-200 px-2.5 py-1 font-medium text-[11px] text-gray-600">
              저장됨
            </span>
          </div>

          {/* Doc 2 */}
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <Upload size={18} className="text-red-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-[14px] text-gray-800">
                하나인증서
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                패턴·지문·Face ID로 간편 인증
              </p>
            </div>
            <button
              type="button"
              className={`${isUser ? `bg-gray-200 text-gray-600` : `bg-hana-ez-600 text-white hover:bg-hana-green-700`} rounded-full border-0 px-2.5 py-1 font-medium text-[11px] transition-colors`}
            >
              {isUser ? '보유 중' : '생성하기'}
            </button>
          </div>
        </div>

        {/* Notice */}
        <AlertBanner
          variant="note"
          icon="💡"
          messageFont="!text-[12px]"
          message={
            '생성된 PDF는 초안이에요. \n 공증인 사무소 방문 시 내용을 함께 검토해요.'
          }
        />
      </div>
      <PrimaryButton
        className="mt-4 mb-3"
        onClick={onNext}
        label={'가까운 공증인 사무소 찾기'}
      />
      <PrimaryButton
        onClick={() => goTo(6)}
        variant="secondary"
        label={'나중에'}
      />
    </div>
  );
}
