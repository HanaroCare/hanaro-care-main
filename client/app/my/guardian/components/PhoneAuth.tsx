import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { usePhoneVerification } from '../../actions/usePhoneVerification';

type Props = {
  onPhoneConfirmed: (phone: string) => void;
  onNext: () => void;
};

export default function PhoneAuth({ onPhoneConfirmed, onNext }: Props) {
  const {
    phone, setPhone,
    otp, setOtp,
    otpSent, isVerified, isLoading, error,
    sendSms, verifyOtp,
  } = usePhoneVerification(onPhoneConfirmed);

  return (
    <div className="pt-6 pb-13 flex flex-col gap-3">
      <div className="mb-6">
        <h1 className="font-bold text-[20px] text-gray-900">본인 인증을 진행해주세요</h1>
      </div>

      <input
        type="tel"
        inputMode="numeric"
        placeholder="휴대폰 번호 입력 (- 없이)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-xl border px-4 py-3.5 outline-none focus:border-hana-green-700"
      />
      <button
        onClick={sendSms}
        disabled={isLoading || phone.replace(/[^0-9]/g, '').length !== 11}
        className="mb-15 w-full rounded-xl bg-hana-green-700 py-3.5 font-semibold text-white disabled:opacity-50"
      >
        {isLoading ? '발송 중...' : '인증번호 받기'}
      </button>

      {otpSent && (
        <>
          <input
            type="text"
            inputMode="numeric"
            placeholder="인증번호 6자리"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full rounded-xl border px-4 py-3.5 outline-none focus:border-hana-green-700"
          />
          <PrimaryButton
            onClick={verifyOtp}
            disabled={isLoading || otp.length !== 6}
            variant={isVerified ? 'disabled' : 'primary'}
            label={isVerified ? '인증 완료' : '인증 확인'}
          />
        </>
      )}

      {error && !isVerified && <p className="text-sm text-red-500">{error}</p>}

      <PrimaryButton
        variant={isVerified ? 'primary' : 'disabled'}
        label={isVerified ? '다음' : '인증을 완료해주세요'}
        onClick={() => { if (isVerified) onNext(); }}
      />
    </div>
  );
}