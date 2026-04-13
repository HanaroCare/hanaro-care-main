'use client';

type ConfirmModalProps = {
  isOpen: boolean;
  title: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  cancelLabel = '닫기',
  confirmLabel = '확인',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-10">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-65 rounded-[24px] bg-white px-6 py-8 shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
      >
        <div
          id="confirm-modal-title"
          className="text-center text-[18px] leading-[30px] font-medium tracking-[-0.03em] text-[#1F2937]"
        >
          {title}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 flex-1 rounded-[14px] bg-[#E9F8F9] text-[15px] font-semibold text-hana-ez-600"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 flex-1 rounded-[14px] bg-hana-ez-600 text-[15px] font-semibold text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
