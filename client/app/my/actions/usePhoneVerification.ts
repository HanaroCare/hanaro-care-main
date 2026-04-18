import { useState } from 'react';
import { sendFindIdSms } from '@/app/(auth)/login/actions/auth';
import { verifySms } from '@/app/(auth)/signup/actions/auth';

export function usePhoneVerification(onPhoneConfirmed: (phone: string) => void) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const rawPhone = phone.replace(/[^0-9]/g, '');

  const sendSms = async () => {
    setIsLoading(true);
    const result = await sendFindIdSms(rawPhone);
    setIsLoading(false);
    if (result.ok) {
      setOtpSent(true);
      onPhoneConfirmed(phone);
    } else {
      setError(result.error);
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    const result = await verifySms(rawPhone, otp);
    setIsLoading(false);
    if (result.ok) {
      setIsVerified(true);
    } else {
      setError(result.error);
    }
  };

  return {
    phone, setPhone,
    otp, setOtp,
    otpSent,
    isVerified,
    isLoading,
    error,
    sendSms,
    verifyOtp,
  };
}