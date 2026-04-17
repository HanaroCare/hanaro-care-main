"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cancelCard } from "@/app/card/actions/card";

interface BlockModalProps {
  cardId: string;
  cardNm: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BlockModal({
  cardId,
  cardNm,
  onClose,
  onConfirm,
}: BlockModalProps) {
  const router = useRouter();

  const handleBlock = async () => {
    await cancelCard(cardId);
    onConfirm();
    router.push(`/card/settings?cardId=${cardId}`);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="w-[283px] bg-white rounded-3xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X size={20} color="#3E454C" />
        </button>
        <p className="text-base font-medium text-hana-black-900 text-center mt-8 leading-6 tracking-tight whitespace-pre-line">
          {`${cardNm}에서\n이상 결제가 감지됐어요\n\n카드 사용을 차단할까요?`}
        </p>
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => router.push(`/card/settings?cardId=${cardId}`)}
            className="flex-1 h-10 rounded-xl bg-hana-red-50 text-hana-red-500 text-sm font-semibold"
          >
            카드 관리하기
          </button>
          <button
            onClick={handleBlock}
            className="flex-1 h-10 rounded-xl bg-hana-red-500 text-white text-sm font-semibold"
          >
            즉시 차단
          </button>
        </div>
      </div>
    </div>
  );
}
