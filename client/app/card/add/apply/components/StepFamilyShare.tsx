"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface FamilyMember {
  id: string;
  name: string;
  initial: string;
  relation: string;
  shareEnabled: boolean;
}

interface StepFamilyShareProps {
  shareAll: boolean;
  members: FamilyMember[];
  onToggleAll: (val: boolean) => void;
  onToggleMember: (id: string, val: boolean) => void;
  onNext: () => void;
  isActive: boolean;
}

export default function StepFamilyShare({
  shareAll,
  members,
  onToggleAll,
  onToggleMember,
  onNext,
  isActive,
}: StepFamilyShareProps) {
  const [alertAgreed, setAlertAgreed] = useState(false);

  const handleToggleAll = (val: boolean) => {
    onToggleAll(val); // toggleAllMembers만 호출
  };

  return (
    <div className="page-in px-8 pt-8 pb-6 border-t border-border-gray">
      <h2 className="text-lg font-semibold leading-[30px] tracking-snug text-black whitespace-pre-line">
        {"결제 내역 공유를\n설정할 수 있어요"}
      </h2>
      <p className="mt-2 text-xs text-[#4A5565] leading-5">
        지출 내역과 알림을 공유할 가족을 선택해요
      </p>

      {/* 전체 가족 공유 토글 */}
      <div className="mt-6 flex items-center justify-between px-4 py-3 bg-hana-green-50 rounded-[14px]">
        <span className="text-xs font-semibold text-hana-green-700">
          전체 가족 공유
        </span>
        <Switch
          checked={shareAll}
          disabled={!isActive}
          onCheckedChange={handleToggleAll}
          className="data-[state=checked]:bg-hana-green-700"
        />
      </div>

      {/* 가족 목록 */}
      <div className="mt-4 flex flex-col gap-3">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between px-4 h-[74px] bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-hana-green-50 flex items-center justify-center">
                <span className="text-lg font-semibold text-hana-ez-600">
                  {m.initial}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-black">
                    {m.name}
                  </span>
                  <span className="px-2 py-0.5 bg-hana-green-50 rounded-full text-[8px] font-semibold text-hana-ez-600">
                    {m.relation}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-[#9DA3AF]">
                  내역 열람
                </span>
              </div>
            </div>
            <Switch
              checked={m.shareEnabled}
              disabled={!isActive}
              onCheckedChange={(val) => onToggleMember(m.id, val)}
              className="data-[state=checked]:bg-hana-green-700"
            />
          </div>
        ))}
      </div>

      {/* 이상 감지 알림 */}
      {/* 이상 감지 알림 */}
      <button
        type="button"
        disabled={!isActive}
        aria-pressed={alertAgreed}
        onClick={() => isActive && setAlertAgreed(!alertAgreed)}
        className={`mt-4 w-full px-4 py-3 rounded-[14px] border transition-colors text-left ${!isActive
          ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
          : alertAgreed
            ? "bg-hana-blue-50 border-hana-blue-300 cursor-pointer"
            : "bg-hana-red-50 border-hana-red-100 cursor-pointer"
          }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p
              className={`text-xs font-medium ${alertAgreed ? "text-hana-blue-600" : "text-hana-red-500"}`}
            >
              이상 감지 알림
            </p>
            <p
              className={`text-[11px] mt-1 leading-5 ${alertAgreed ? "text-hana-blue-500" : "text-hana-red-500"}`}
            >
              차단 카테고리 결제 시도, 한도 초과, 심야 결제 등 이상 지출이
              감지되면 선택한 가족 전체에게 즉시 알림이 가요.
            </p>
          </div>
          <div
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${alertAgreed
              ? "border-hana-blue-500 bg-hana-blue-500"
              : "border-hana-red-400 bg-transparent"
              }`}
          >
            {alertAgreed && (
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                <path
                  d="M1 5.5L5 9.5L13 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
      </button>

      {isActive && (
        <button
          onClick={onNext}
          disabled={!alertAgreed}
          className="mt-6 w-full h-[53px] rounded-xl text-white text-base font-medium transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-hana-ez-600 hover:bg-hana-green-700"
        >
          발급 완료
        </button>
      )}
    </div>
  );
}
