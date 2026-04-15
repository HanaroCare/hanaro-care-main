'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import AudioPlayer from '@/app/inheritance/components/letter/AudioPlayer';
import InheritanceMethodToggle from '@/app/inheritance/components/letter/InheritanceMethodToggle';
import MessageInput from '@/app/inheritance/components/letter/MessageInput';
import NicknameInput from '@/app/inheritance/components/letter/NicknameInput';
import RecipientHeader from '@/app/inheritance/components/letter/RecipientHeader';
import VoiceRecorderSheet from '@/app/inheritance/components/letter/VoiceRecorderSheet';
import YearsInput from '@/app/inheritance/components/letter/YearsInput';
import {
  createLetterFormData,
  inheritanceApi,
} from '@/app/inheritance/inheritApi';
import type { InheritanceMethod } from '@/app/inheritance/types';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { mockRecipients } from '../../data';

export default function InheritanceWritePage({
  params,
}: {
  params: Promise<{ inheritDetailId: string }>;
}) {
  const { inheritDetailId } = use(params);

  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [yearsLater, setYearsLater] = useState<number | null>(null);
  const [method, setMethod] = useState<InheritanceMethod>('once');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVoiceSheet, setShowVoiceSheet] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. 서버 전송용 데이터 (필수 데이터만!)
      const formData = createLetterFormData({
        inheritDetailId,
        letterCont: message,
        letterTypeCd: audioBlob ? 'VOICE' : 'WRITING',
        audioBlob,
      });

      // 2. 백엔드 API 호출
      await inheritanceApi.sendLetter(formData);

      // 3. 결과 페이지로 이동 (보여주기용 데이터 포함)
      const queryParams = new URLSearchParams({
        method,
        nickname: nickname || '',
        yearsLater: String(yearsLater || 0),
      }).toString();

      router.push(`/inheritance/letter/recipients/result?${queryParams}`);
    } catch (error) {
      console.error('전송 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const recipient =
    mockRecipients.find(
      (r: { id: number }) => r.id === parseInt(inheritDetailId, 10),
    ) ?? mockRecipients[0];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex min-h-screen flex-col">
        {/* Form */}
        <div className="flex flex-1 flex-col gap-7 pt-6">
          <RecipientHeader recipient={recipient} onEdit={() => router.back()} />
          <NicknameInput value={nickname} onChange={setNickname} />
          <YearsInput value={yearsLater} onChange={setYearsLater} />
          <InheritanceMethodToggle value={method} onChange={setMethod} />
          {audioUrl ? (
            <div>
              <div className="flex w-full justify-center">
                <AudioPlayer audioUrl={audioUrl} />
              </div>

              <button
                type="button"
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl(null);
                }}
                className="flex w-full items-center justify-end gap-1.5 pt-2 pr-4 text-gray-500 text-sm"
              >
                녹음 삭제하기
              </button>
            </div>
          ) : (
            <MessageInput
              value={message}
              onChange={setMessage}
              onVoice={() => setShowVoiceSheet(true)}
            />
          )}
          <PrimaryButton
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-4"
            label={isSubmitting ? '저장 중...' : '작성 완료'}
          />
        </div>
      </div>
      {showVoiceSheet && (
        <VoiceRecorderSheet
          onClose={() => setShowVoiceSheet(false)}
          onSave={(blob) => {
            if (audioUrl) {
              URL.revokeObjectURL(audioUrl);
            }
            setAudioBlob(blob);
            setAudioUrl(URL.createObjectURL(blob));
            setShowVoiceSheet(false);
          }}
        />
      )}
    </div>
  );
}
