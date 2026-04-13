"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PrimaryButton from "../../../../components/PrimaryButton";

type TermsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

/**
 * 약관 상세 내용을 보여주는 바텀시트 형식의 모달
 */
export default function TermsModal({ isOpen, onClose, title, content }: TermsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: "100%", x: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-1/2 z-[120] flex h-[60dvh] w-full max-w-[375px] flex-col rounded-t-[1.5rem] bg-white shadow-2xl"
          >
            <div className="flex w-full items-center justify-center pt-[0.75rem] pb-[0.25rem]">
              <div className="h-[0.25rem] w-[2.5rem] rounded-full bg-gray-200" />
            </div>

            <div className="flex h-[3.5rem] shrink-0 items-center justify-between border-b border-border px-[1.25rem]">
              <div className="w-[2rem]" />
              <h3 className="text-[1.0625rem] font-bold text-foreground">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-[0.5rem] text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-[1.5rem] text-[0.9375rem] leading-[1.6] text-hana-black-700">
              <div className="whitespace-pre-line">{content}</div>
            </div>

            <div className="border-t border-border p-[1.5rem] pb-[2.5rem]">
              <PrimaryButton label="확인" onClick={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
