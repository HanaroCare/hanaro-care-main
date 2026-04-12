"use client";

import { X } from "lucide-react";

interface CancelModalProps {
  onClose: () => void;
}

export default function CancelModal({ onClose }: CancelModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="w-[283px] bg-white rounded-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X size={20} color="#3E454C" />
        </button>
        <p className="text-base font-medium text-hana-black-900 text-center mt-8 tracking-tight">
          해지가 완료되었습니다.
        </p>
      </div>
    </div>
  );
}