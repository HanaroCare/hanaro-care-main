'use client';

import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { AlertBanner } from '@/components/modules/AlertBanner';
import { getContractBlob, getUserName } from '../../actions/guardianActions';
import type { GuardianData } from '../types/types';

type Props = {
  data: GuardianData;

  onNext: () => void;
  goTo: (step: number) => void;
};

// 권한 인덱스별 이름 매핑 (요약 화면용)
const PERMISSION_NAMES = [
  '재산 관리',
  '의료 결정',
  '요양 시설',
  '계약 체결',
  '법적 대리',
];

export default function Step5GenerateDocs({ data, onNext, goTo }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const name = await getUserName();
        setUserName(name);
      } catch (e) {
        console.error(e);
      }
    };

    fetchUser();
  }, []);

  // 1. 데이터 요약 표시용 가공

  const guardianName = data.selectedPerson?.name || '-';
  // true인 권한들만 필터링해서 텍스트로 결합
  const selectedPermissionLabels = data.permissions
    .map((checked, i) => (checked ? PERMISSION_NAMES[i] : null))
    .filter(Boolean)
    .join(', ');

  // 2. 계약서 생성 및 다운로드 함수
  const handleGenerateContract = async () => {
    try {
      setIsDownloading(true);

      // 백엔드 ContractDto 규격에 맞게 조립
      const blob = await getContractBlob({
        guardianName: guardianName,
        guardianRelation: data.relationship,
        permission: data.permissions, // [true, false, ...] boolean[5]
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = 'contract.docx'; // 파일명
      a.click();

      URL.revokeObjectURL(url);

      // 다운로드 완료 후 다음 단계로 이동
      onNext();
    } catch (error) {
      console.error('계약서 생성 실패:', error);
      alert('계약서 생성 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

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
            입력하신 정보를 바탕으로 문서를 자동으로 만들어드려요
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
                value: selectedPermissionLabels || '선택 없음',
                accent: true,
              },
              { label: '본인', value: userName, accent: false },
              {
                label: '등록일',
                value: new Date().toLocaleDateString(),
                accent: false,
              },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                className="flex items-start justify-between gap-2"
              >
                <span className="shrink-0 text-[13px] text-gray-500">
                  {label}
                </span>
                <span
                  className={`wrap-break-word text-right font-medium text-[13px] ${accent ? 'text-hana-ez-600' : 'text-gray-800'}`}
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
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0F7F4]">
              <FileText size={18} className="text-teal-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-[14px] text-gray-800">
                임의후견계약서 초안
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                계약서_{data.userName}.docx
              </p>
            </div>
            <span className="rounded-full bg-gray-200 px-2.5 py-1 font-medium text-[11px] text-gray-600">
              준비됨
            </span>
          </div>
        </div>

        <AlertBanner
          variant="note"
          icon="💡"
          messageFont="!text-[12px]"
          message={
            '생성된 문서는 초안이에요. \n 공증인 사무소 방문 시 내용을 함께 검토해요.'
          }
        />
      </div>

      <PrimaryButton
        className="mt-4 mb-3"
        onClick={handleGenerateContract}
        disabled={isDownloading}
        label={isDownloading ? '생성 중...' : '계약서 생성 및 사무소 찾기'}
      />

      <PrimaryButton
        onClick={() => goTo(6)}
        variant="secondary"
        label={'나중에'}
      />
    </div>
  );
}
