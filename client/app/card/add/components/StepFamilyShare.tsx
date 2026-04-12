"use client";

import { Switch } from "@/components/ui/switch";

interface FamilyMember {
  id: number;
  name: string;
  initial: string;
  relation: string;
  shareEnabled: boolean;
}

interface StepFamilyShareProps {
  shareAll: boolean;
  members: FamilyMember[];
  onToggleAll: (val: boolean) => void;
  onToggleMember: (id: number, val: boolean) => void;
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
  return (
    <div className="page-in px-8 pt-8 pb-6 border-t border-border-gray">
      <h2 className="text-lg font-semibold leading-[30px] tracking-snug text-black whitespace-pre-line">
        {"가족 공유 설정을\n할 수 있어요"}
      </h2>
      <p className="mt-2 text-xs text-[#4A5565] leading-5">
        지출 내역과 알림을 공유할 가족을 선택해요
      </p>

      {/* 전체 가족 공유 토글 */}
      <div className="mt-6 flex items-center justify-between px-4 py-3 bg-hana-green-50 rounded-[14px]">
        <span className="text-xs font-semibold text-hana-green-700">전체 가족 공유</span>
        <Switch
          checked={shareAll}
          disabled={!isActive}
          onCheckedChange={onToggleAll}
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
              {/* 아바타 */}
              <div className="w-10 h-10 rounded-full bg-hana-green-50 flex items-center justify-center">
                <span className="text-lg font-semibold text-hana-ez-600">{m.initial}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-black">{m.name}</span>
                  <span className="px-2 py-0.5 bg-hana-green-50 rounded-full text-[8px] font-semibold text-hana-ez-600">
                    {m.relation}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-[#9DA3AF]">내역 열람</span>
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

      {/* 이상 감지 알림 안내 */}
      <div className="mt-4 px-4 py-3 bg-hana-red-50 rounded-[14px]">
        <p className="text-xs font-medium text-hana-red-500">이상 감지 알림</p>
        <p className="text-[11px] text-hana-red-500 mt-1 leading-5">
          차단 카테고리 결제 시도, 한도 초과, 심야 결제 등 이상 지출이 감지되면 선택한 가족 전체에게 즉시 알림이 가요.
        </p>
      </div>

      {isActive && (
        <button
          onClick={onNext}
          className="mt-6 w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium hover:bg-hana-green-700 transition-colors"
        >
          발급 완료
        </button>
      )}
    </div>
  );
}