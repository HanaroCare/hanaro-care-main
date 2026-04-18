'use client';

import { FileCheck, FileText } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import TrustStepLayout from '../../components/trust/TrustStepLayout';
import { handleReservation } from '../../constants/trustUtils';

export default function ChangeAgentChildPage() {
  const searchParams = useSearchParams();
  const parentName = searchParams.get('name');

  const handleFamilyDoc = () => {
    window.location.href =
      'https://www.gov.kr/main?a=AA020InfoCappViewApp&HighCtgCD=A01008&CappBizCD=97400000004';
  };

  const handleGuardianshipDoc = () => {
    window.location.href =
      'https://egdrs.scourt.go.kr/ug/SrvcGuideDtlInq.do?bltnBordId=042018000002';
  };

  return (
    <TrustStepLayout
      footer={
        <footer className="shrink-0 bg-white px-6 py-4">
          <PrimaryButton
            label="상담 예약하기"
            className="h-14 rounded-2xl text-[16px] leading-6"
            onClick={handleReservation}
          />
        </footer>
      }
    >
      <Header title="신탁 열람 권한 신청" showBackButton />
      <section className="px-6 pt-2">
        <div className="mt-14">
          <h2 className="text-[22px] leading-[1.45] font-bold tracking-tight text-black">
            신탁 현황 열람 권한 신청하기
          </h2>
          <p className="mt-4 text-[14px] leading-5 font-normal tracking-snug text-[#6A7282]">
            자산이 오직 부모님의 치료와 안녕을 위해서만 쓰이도록
            <br />
            열람 권한을 신청하여 자산 운용 현황을 확인하세요
          </p>
        </div>

        <div className="mt-12">
          <p className="mb-3 text-[13px] leading-5 font-medium tracking-snug text-[#6A7282]">
            위탁자(부모님) 정보
          </p>

          <div className="rounded-4xl border border-[#F2F3F5] bg-white px-5 py-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            {parentName ? (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F8F9] text-[20px] font-semibold text-hana-ez-600">
                  {parentName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] leading-6 font-semibold tracking-tight text-black">
                      {parentName}
                    </span>
                    <span className="rounded-full bg-[#E9F8F9] px-2.5 py-1 text-[11px] leading-4 font-medium text-hana-ez-600">
                      부모
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[14px] text-[#9CA3AF]">
                연동된 부모님 정보가 없어요.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-[13px] leading-5 font-medium tracking-snug text-[#6A7282]">
            열람 권한 신청을 위한 본인 확인 서류
          </p>

          <div className="flex flex-col gap-3">
            <DocumentItem
              title="가족관계 증명서"
              desc="정부24에서 발급받기"
              iconBg="#E9F8F9"
              buttonLabel="발급받기"
              icon={<FileText size={20} className="text-hana-ez-600" />}
              onClick={handleFamilyDoc}
            />

            <DocumentItem
              title="후견 증명서"
              desc={"전자후견등기에서\n발급받기"}
              iconBg="#FDEEEE"
              buttonLabel="발급받기"
              icon={<FileCheck size={20} className="text-hana-red-500" />}
              onClick={handleGuardianshipDoc}
            />
          </div>
        </div>
      </section>
    </TrustStepLayout>
  );
}

function DocumentItem({
  title,
  desc,
  buttonLabel,
  icon,
  iconBg,
  onClick,
}: {
  title: string;
  desc: string;
  buttonLabel: string;
  icon: ReactNode;
  iconBg: string;
  onClick?: () => void;
}) {
  return (
    <div className="rounded-[20px] border border-[#F2F3F5] bg-white px-5 py-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: iconBg }}
          >
            {icon}
          </div>

          <div>
            <p className="text-[15px] leading-6 font-semibold tracking-tight text-black">
              {title}
            </p>
            <p className="whitespace-pre-line text-[12px] leading-5 text-[#6A7282]">{desc}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClick}
          className="rounded-xl bg-hana-ez-600 px-3 py-2 text-[12px] font-semibold text-white"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
