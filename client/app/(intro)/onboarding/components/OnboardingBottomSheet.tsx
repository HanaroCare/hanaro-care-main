import { useRouter } from "next/navigation";

type OnboardingBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * 온보딩 완료 후 로그인/회원가입 바텀시트
 */
export default function OnboardingBottomSheet({
  isOpen,
  onClose,
}: OnboardingBottomSheetProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="absolute inset-0 z-40 w-full h-full bg-black/40 transition-opacity animate-in fade-in border-none outline-none"
        onClick={onClose}
        aria-label="바텀시트 닫기"
      />

      <div className="absolute bottom-0 left-0 right-0 z-50 flex flex-col items-center rounded-t-[1.5rem] bg-card p-[1.5rem] pt-[2rem] pb-[3rem] shadow-2xl animate-in slide-in-from-bottom-full duration-300">
        <div className="flex w-full items-center justify-center pb-[1.75rem]">
          <div className="h-[0.375rem] w-[3rem] rounded-full bg-gray-200" />
        </div>

        <p className="mb-[2rem] text-center font-bold text-foreground text-[1.25rem]">
          이미 회원이신가요?
          <br />
          <span className="text-[1rem] font-medium text-muted-foreground">또는 처음 오셨나요?</span>
        </p>

        <div className="flex w-full flex-col gap-[0.75rem]">
          <button
            type="button"
            onClick={() => router.push("/login/hanaCert")}
            className="h-[3.2rem] w-full rounded-xl bg-primary font-bold text-[1.125rem] text-white transition-all active:scale-[0.98] hover:bg-primary/90 outline-none"
          >
            하나인증서로 로그인
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="h-[3.2rem] w-full rounded-xl border border-gray-200 bg-transparent font-bold text-[1.125rem] text-gray-700 transition-all active:scale-[0.98] hover:bg-gray-50 outline-none"
          >
            로그인
          </button>

          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="h-[3.2rem] w-full rounded-xl border border-border bg-white font-bold text-[1.125rem] text-foreground transition-all active:scale-[0.98] hover:bg-gray-50 outline-none"
          >
            회원가입
          </button>
        </div>
      </div>
    </>
  );
}
