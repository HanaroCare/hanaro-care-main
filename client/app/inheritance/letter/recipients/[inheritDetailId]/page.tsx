'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { inheritanceApi } from '@/app/inheritance/api/inheritApi';
import AudioPlayer from '@/app/inheritance/components/letter/AudioPlayer';
import InheritanceMethodToggle from '@/app/inheritance/components/letter/InheritanceMethodToggle';
import MessageInput from '@/app/inheritance/components/letter/MessageInput';
import NicknameInput from '@/app/inheritance/components/letter/NicknameInput';
import RecipientHeader from '@/app/inheritance/components/letter/RecipientHeader';
import VoiceRecorderSheet from '@/app/inheritance/components/letter/VoiceRecorderSheet';
import YearsInput from '@/app/inheritance/components/letter/YearsInput';
import type { InheritanceMethod } from '@/app/inheritance/types';
import { createLetterFormData } from '@/app/inheritance/utils/createLetterFormData';
import PrimaryButton from '@/components/baseelements/PrimaryButton';

export default function InheritanceWritePage({
  params,
}: {
  params: Promise<{ inheritDetailId: string }>;
}) {
  const { inheritDetailId } = use(params);
  const router = useRouter();

  const { data: recipients, isLoading } = useQuery({
    queryKey: ['inheritanceInfo'],
    queryFn: inheritanceApi.getInheritanceInfo,
  });

  const recipient = recipients?.find(
    (r) => String(r.inheritDetailId) === inheritDetailId,
  );

  const [nickname, setNickname] = useState('');
  const [yearsLater, setYearsLater] = useState<number | null>(null);
  const [method, setMethod] = useState<InheritanceMethod>('once');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVoiceSheet, setShowVoiceSheet] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  if (isLoading) {
    return <div className="p-8 text-center">불러오는 중...</div>;
  }

  if (!recipient) {
    return <div className="p-8 text-center">대상을 찾을 수 없습니다.</div>;
  }

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

      await inheritanceApi.sendLetter(formData);

      const queryParams = new URLSearchParams({
        inheritDetailId,
        method,
        nickname: nickname || '',
        yearsLater: String(yearsLater || 0),
      }).toString();

      router.push(`/inheritance/letter/recipients/result?${queryParams}`);
    } catch (error) {
      console.error(error);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-155px)] flex-col bg-white">
      <div className="flex flex-col">
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
                className="flex w-full justify-end pt-2 pr-4 text-gray-500 text-sm"
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
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            setAudioBlob(blob);
            setAudioUrl(URL.createObjectURL(blob));
            setShowVoiceSheet(false);
          }}
        />
      )}
    </div>
  );
}
