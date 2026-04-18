"use client";

import { Phone, X } from "lucide-react";

interface PhonePopupProps {
  phone: string;
  name?: string;
  onClose: () => void;
}

export default function PhonePopup({ phone, name, onClose }: PhonePopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[375px] bg-white rounded-t-[20px] px-[25px] pt-[28px] pb-[36px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-[20px]">
          <span className="font-semibold text-[16px] text-[#1A212D]">
            {name ?? "전화 상담"}
          </span>
          <button onClick={onClose} className="p-1">
            <X size={20} color="#6B7280" />
          </button>
        </div>

        <div className="flex items-center gap-[10px] px-[16px] py-[14px] bg-[#F6F7F8] rounded-xl mb-[20px]">
          <Phone size={18} color="#008485" />
          <span className="font-semibold text-[18px] tracking-wide text-[#1A212D]">
            {phone}
          </span>
        </div>

        <div className="flex gap-[8px]">
          <button
            onClick={onClose}
            className="flex-1 h-[50px] rounded-[10px] font-medium text-[15px] text-[#535C6A] bg-[#F0F1F3]"
          >
            취소
          </button>
          <a
            href={`tel:${phone.replace(/-/g, "")}`}
            className="flex-1 h-[50px] rounded-[10px] font-medium text-[15px] text-white bg-[#01A5AC] flex items-center justify-center gap-[6px]"
          >
            <Phone size={16} color="white" />
            전화 연결
          </a>
        </div>
      </div>
    </div>
  );
}
