'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendLetter } from '@/app/inheritance/actions/letterActions';
import type { InheritanceMethod } from '@/app/inheritance/types';
import { createLetterFormData } from '@/app/inheritance/utils/createLetterFormData';

export function useLetter(inheritDetailId: string) {
  const router = useRouter();

  // Form States
  const [nickname, setNickname] = useState('');
  const [yearsLater, setYearsLater] = useState<number | null>(null);
  const [method, setMethod] = useState<InheritanceMethod>('once');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice States
  const [showVoiceSheet, setShowVoiceSheet] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleVoiceSave = (blob: Blob) => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(blob);
    setAudioUrl(URL.createObjectURL(blob));
    setShowVoiceSheet(false);
  };

  const resetAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = createLetterFormData({
        inheritDetailId,
        letterCont: message,
        letterTypeCd: audioBlob ? 'VOICE' : 'WRITING',
        audioBlob,
      });

      await sendLetter(formData);

      const queryParams = new URLSearchParams({
        inheritDetailId,
        method,
        nickname: nickname || '',
        yearsLater: String(yearsLater || 0),
      }).toString();

      router.push(`/inheritance/letter/recipients/result?${queryParams}`);
    } catch (error) {
      alert('저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form: {
      nickname,
      setNickname,
      yearsLater,
      setYearsLater,
      method,
      setMethod,
      message,
      setMessage,
    },
    voice: {
      showVoiceSheet,
      setShowVoiceSheet,
      audioUrl,
      handleVoiceSave,
      resetAudio,
    },
    isSubmitting,
    handleSubmit,
  };
}
