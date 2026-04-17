'use client';

import { useRouter } from 'next/navigation';
import AudioPlayer from '@/app/inheritance/components/letter/AudioPlayer';
import InheritanceMethodToggle from '@/app/inheritance/components/letter/InheritanceMethodToggle';
import MessageInput from '@/app/inheritance/components/letter/MessageInput';
import NicknameInput from '@/app/inheritance/components/letter/NicknameInput';
import RecipientHeader from '@/app/inheritance/components/letter/RecipientHeader';
import VoiceRecorderSheet from '@/app/inheritance/components/letter/VoiceRecorderSheet';
import YearsInput from '@/app/inheritance/components/letter/YearsInput';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import type { InheritanceSummaryDto } from '../../letter/types';

interface Props {
  recipient: InheritanceSummaryDto;
  hook: any; // 위에서 만든 커스텀 훅의 리턴 타입
}

export default function InheritanceLetterView({ recipient, hook }: Props) {
  const router = useRouter();
  const { form, voice, isSubmitting, handleSubmit } = hook;

  return (
    <div className="flex min-h-[calc(100vh-155px)] flex-col bg-white">
      <div className="flex flex-1 flex-col gap-7 pt-6">
        <RecipientHeader recipient={recipient} onEdit={() => router.back()} />

        <NicknameInput value={form.nickname} onChange={form.setNickname} />
        <YearsInput value={form.yearsLater} onChange={form.setYearsLater} />
        <InheritanceMethodToggle
          value={form.method}
          onChange={form.setMethod}
        />

        {voice.audioUrl ? (
          <div>
            <div className="flex w-full justify-center">
              <AudioPlayer audioUrl={voice.audioUrl} />
            </div>
            <button
              type="button"
              onClick={voice.resetAudio}
              className="flex w-full justify-end pt-2 pr-4 text-gray-500 text-sm"
            >
              녹음 삭제하기
            </button>
          </div>
        ) : (
          <MessageInput
            value={form.message}
            onChange={form.setMessage}
            onVoice={() => voice.setShowVoiceSheet(true)}
          />
        )}

        <PrimaryButton
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-4"
          label={isSubmitting ? '저장 중...' : '작성 완료'}
        />
      </div>

      {voice.showVoiceSheet && (
        <VoiceRecorderSheet
          onClose={() => voice.setShowVoiceSheet(false)}
          onSave={voice.handleVoiceSave}
        />
      )}
    </div>
  );
}
