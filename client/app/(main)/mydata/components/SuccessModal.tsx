"use client";

import PrimaryButton from "../../../../components/PrimaryButton";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet } from "lucide-react";

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * 연결 완료 성공 모달
 */
export default function SuccessModal({ isOpen, onClose, onConfirm }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-[101] w-[90%] max-w-[21rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.5rem] bg-white p-[1.75rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-[1.25rem] flex h-[4rem] w-[4rem] items-center justify-center rounded-full bg-hana-ez-50 text-primary">
                <Wallet size={32} />
              </div>

              <h3 className="mb-[0.5rem] text-[1.25rem] font-bold tracking-tight text-foreground">
                금융 자산 연결 완료!
              </h3>
              <p className="mb-[1.75rem] text-[0.875rem] font-medium leading-relaxed text-muted-foreground">
                이제 부동산, 자동차 등 실물 자산도
                <br />
                함께 연동해 볼까요?
              </p>

              <div className="flex w-full flex-col gap-[0.5rem]">
                <PrimaryButton
                  label="실물 자산 연동하기"
                  onClick={onConfirm}
                  className="!h-[3.2rem] text-[1rem]"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-[0.25rem] flex h-[2.5rem] w-full items-center justify-center text-[0.875rem] font-medium text-muted-foreground transition-colors hover:text-foreground active:opacity-70"
                >
                  나중에 하기
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
