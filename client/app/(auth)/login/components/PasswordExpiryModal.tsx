"use client";

type PasswordExpiryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function PasswordExpiryModal({
  isOpen,
  onClose,
  onConfirm,
}: PasswordExpiryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-[1.5rem]">
      <div className="w-full max-w-[20rem] rounded-[1rem] bg-white px-[1.5rem] pt-[1.75rem] pb-[1.25rem] shadow-2xl">
        <h3 className="text-[1.125rem] font-bold text-foreground text-center mb-[1rem]">
          비밀번호 변경 안내
        </h3>
        <div className="flex flex-col gap-[0.625rem] text-center mb-[1.75rem]">
          <p className="text-[0.9375rem] text-foreground font-medium leading-snug">
            비밀번호를 변경한 지<br />6개월이 지났습니다.
          </p>
          <p className="text-[0.875rem] text-muted-foreground leading-snug">
            안전한 서비스 이용을 위해<br />비밀번호를 변경해주세요.
          </p>
        </div>
        <div className="flex gap-[0.5rem]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[3rem] rounded-[0.75rem] bg-gray-100 text-[1rem] font-semibold text-gray-500 transition-colors hover:bg-gray-200 active:scale-[0.98]"
          >
            다음에 하기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-[3rem] rounded-[0.75rem] bg-primary text-[1rem] font-semibold text-white transition-colors hover:bg-primary/90 active:scale-[0.98]"
          >
            지금 변경하기
          </button>
        </div>
      </div>
    </div>
  );
}
