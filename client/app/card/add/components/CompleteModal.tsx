"use client";

interface CompleteModalProps {
  onConfirm: () => void;
  onReset: () => void;
}

export default function CompleteModal({ onConfirm, onReset }: CompleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="w-[283px] bg-white rounded-3xl p-6">
        <p className="text-base font-medium text-hana-black-900 text-center leading-6 tracking-tight">
          카드 설정을 마치겠습니까?
        </p>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onReset}
            className="flex-1 h-10 rounded-xl bg-hana-green-50 text-hana-green-700 text-sm font-semibold"
          >
            다시 설정하기
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl bg-hana-ez-600 text-white text-sm font-semibold"
          >
            다음으로
          </button>
        </div>
      </div>
    </div>
  );
}