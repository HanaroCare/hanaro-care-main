"use client";

import { X } from "lucide-react";

interface CancelModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelModal({ onClose, onConfirm }: CancelModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="w-[283px] bg-white rounded-3xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X size={20} color="#3E454C" />
        </button>
        <p className="text-base font-medium text-hana-black-900 text-center mt-8 leading-6 tracking-tight whitespace-pre-line">
          {"카드를 해지하면\n즉시 사용이 중단돼요.\n\n정말 해지할까요?"}
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl bg-hana-silver-100 text-hana-black-800 text-sm font-semibold"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl bg-hana-red-500 text-white text-sm font-semibold"
          >
            네, 해지할게요
          </button>
        </div>
      </div>
    </div>
  );
}