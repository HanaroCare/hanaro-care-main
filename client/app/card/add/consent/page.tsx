"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { Check } from "lucide-react";
import Header from "@/components/navigation/Header";
import PrimaryButton from "@/components/baseelements/PrimaryButton";

const TERMS = [
  {
    id: "privacy",
    label: "개인정보 수집 및 이용 동의",
    required: true,
    content: `■ 수집·이용 목적\n- 돌봄 지갑 서비스 제공 및 본인 확인(KYC)\n- 선불전자지급수단 발급·관리\n- 사용 내역 조회 및 알림 발송\n- 부정거래 탐지(FDS) 및 이상거래 모니터링\n- 법령상 의무 이행(자금세탁방지, 전자금융거래법)\n\n■ 수집 항목\n필수: 성명, 생년월일, 휴대폰번호, 실명확인 정보(CI/DI), 계좌정보\n선택: 이메일 주소\n\n■ 보유·이용 기간\n- 서비스 이용 계약 종료 후 5년 (전자금융거래법 제22조)\n\n■ 동의 거부 시 불이익\n본 동의는 서비스 이용을 위한 필수 항목으로, 동의를 거부하실 경우 돌봄 지갑 서비스 이용이 불가합니다.`,
  },
  {
    id: "thirdParty",
    label: "제3자 정보 제공 동의",
    required: true,
    content: `■ 제공 목적\n선불전자지급수단 발급·결제 처리, 본인인증, 이상거래 탐지\n\n■ 제공 받는 자\n- 하나카드(주): 선불카드 발급 및 결제 처리\n- NICE평가정보(주) / KCB: 본인 실명 확인\n- 금융결제원: 계좌 실명 확인\n\n■ 동의 거부 시 불이익\n동의를 거부하실 경우 돌봄 지갑 발급 및 결제 서비스 이용이 제한됩니다.`,
  },
  {
    id: "uniqueId",
    label: "고유식별정보 처리 동의",
    required: true,
    content: `■ 처리 목적\n본인 실명확인(KYC) 및 전자금융거래법상 이용자 확인 의무 이행\n\n■ 처리 항목\n주민등록번호 (본인인증 기관을 통한 CI 변환 후 처리, 원본 미저장)\n\n■ 동의 거부 시 불이익\n실명확인이 불가하여 서비스 이용이 불가합니다.`,
  },
  {
    id: "sensitive",
    label: "민감정보 처리 동의",
    required: true,
    content: `■ 처리 목적\n돌봄 수혜자의 돌봄 서비스 이용 현황 파악 및 가족 알림 제공, 의심 거래 탐지\n\n■ 처리 항목\n돌봄 관련 지출 내역 (의료기관, 약국, 요양시설 등 MCC 기반 분류 정보 포함)\n\n■ 동의 거부 시 불이익\n동의를 거부하실 경우 돌봄 지출 분류 및 가족 알림 기능 이용이 제한됩니다.`,
  },
  {
    id: "delegation",
    label: "관리형 위임 사용 동의",
    required: true,
    content: `■ 위임 구조\n① 카드 명의 및 계정 소유: 관리자\n② 결제 사용 권한: 관리자가 지정한 사용자에게 제한적으로 위임\n③ 충전·내역조회·한도변경·카드정지: 관리자 전용\n\n■ 책임 소재\n지정 사용자의 모든 결제 행위에 대한 최종 법적 책임은 명의자(관리자)에게 귀속됩니다.\n\n■ 동의 거부 시 불이익\n본 동의를 거부하실 경우 돌봄 지갑 서비스 전체를 이용하실 수 없습니다.`,
  },
];

function TermModal({
  term,
  onClose,
}: {
  term: (typeof TERMS)[0];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[20px] w-full max-w-[480px] max-h-[75vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <span className="text-[15px] font-bold text-gray-900">
            [필수] {term.label}
          </span>
          <button onClick={onClose} className="text-gray-400 text-xl">
            ×
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap">
          {term.content}
        </div>
      </div>
    </div>
  );
}

interface CardConsentPageProps {
  onComplete?: () => void;
}

export default function CardConsentPage({ onComplete }: CardConsentPageProps) {
  const router = useRouter();
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [openTerm, setOpenTerm] = useState<(typeof TERMS)[0] | null>(null);

  const allChecked = TERMS.every((t) => checkedIds.includes(t.id));

  const toggleAll = () => {
    setCheckedIds(allChecked ? [] : TERMS.map((t) => t.id));
  };

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="돌봄 지갑 동의서" />

      <main className="flex-1 px-5 pt-8 pb-32">
        <div className="mb-8">
          <h2 className="text-[1.1rem] font-bold text-gray-900 leading-tight mb-1">
            서비스 이용을 위해
            <br />
            동의가 필요해요
          </h2>
          <p className="text-[0.75rem] font-medium text-gray-500">
            아래 항목을 확인하고 동의해주세요
          </p>
        </div>

        {/* 전체 동의 */}
        <button
          type="button"
          onClick={toggleAll}
          className={`flex items-center gap-3 w-full p-4 rounded-xl border cursor-pointer transition-colors mb-5 ${
            allChecked
              ? "border-hana-ez-600 bg-hana-ez-50"
              : "border-gray-100 bg-white shadow-sm"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
              allChecked
                ? "bg-hana-ez-600 border-hana-ez-600 text-white"
                : "border-gray-200 bg-white text-transparent"
            }`}
          >
            <Check size={14} strokeWidth={4} />
          </div>
          <span className="text-[1.1rem] font-bold text-gray-900">
            전체 동의
          </span>
        </button>

        {/* 개별 항목 */}
        <div className="flex flex-col gap-5 px-1">
          {TERMS.map((term, i) => {
            const isChecked = checkedIds.includes(term.id);
            return (
              <div
                key={term.id}
                className={`flex items-center gap-3 pb-5 ${i < TERMS.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(term.id)}
                  className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isChecked
                      ? "bg-hana-ez-600 border-hana-ez-600 text-white"
                      : "border-gray-200 bg-white text-transparent"
                  }`}
                >
                  <Check size={14} strokeWidth={4} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpenTerm(term)}
                  className="flex-1 text-left text-[0.9rem]"
                >
                  <span className="text-hana-ez-600 font-semibold">
                    [필수]{" "}
                  </span>
                  <span className="text-gray-700 font-medium">
                    {term.label}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpenTerm(term)}
                  className="text-gray-400 text-lg px-1"
                >
                  ›
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-[12px] text-gray-400 mt-6 leading-relaxed">
          ※ 관리형 위임 사용 동의는 전자금융거래법 제18조에 따른 대리사용 구조에
          관한 사항입니다.
        </p>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white px-5 pb-8 pt-4">
        <PrimaryButton
          label="동의하고 시작하기"
          disabled={!allChecked}
          onClick={() => {
            if (onComplete) {
              onComplete();
            } else {
              router.push("/card/add" as Route);
            }
          }}
          fullWidth={true}
        />
      </div>

      {openTerm && (
        <TermModal term={openTerm} onClose={() => setOpenTerm(null)} />
      )}
    </div>
  );
}
