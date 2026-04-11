"use client";

import AudioPlayer from "@/app/inheritance/components/letter/AudioPlayer";
import InheritanceMethodToggle from "@/app/inheritance/components/letter/InheritanceMethodToggle";
import MessageInput from "@/app/inheritance/components/letter/MessageInput";
import NicknameInput from "@/app/inheritance/components/letter/NicknameInput";
import RecipientHeader from "@/app/inheritance/components/letter/RecipientHeader";
import VoiceRecorderSheet from "@/app/inheritance/components/letter/VoiceRecorderSheet";
import YearsInput from "@/app/inheritance/components/letter/YearsInput";
import type { InheritanceMethod } from "@/app/inheritance/types";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { submitInheritanceLetter } from "../../../actions/letter/inheritance";
import { mockRecipients } from "../../data";

export default function InheritanceWritePage({
  params,
}: {
  params: Promise<{ inheritDetailId: string }>;
}) {
  const { inheritDetailId } = use(params);

  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [yearsLater, setYearsLater] = useState<number | null>(null);
  const [method, setMethod] = useState<InheritanceMethod>("once");
  const [message, setMessage] = useState("");
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
    setIsSubmitting(true);
    await submitInheritanceLetter({
      recipientId: parseInt(inheritDetailId, 10),
      nickname,
      yearsLater,
      method,
      message,
    });
    // TODO: 백 연결시 formData로 오디오 업로드 및 audioUrl 받아오기
    // 	if (audioBlob) {
    //   const formData = new FormData();
    //   formData.append("audio", audioBlob, "voice.mp3");
    //   // 서버에 업로드
    // }
    setIsSubmitting(false);
    router.push(`/inheritance/letter/recipients/result?method=${method}`);
  };

  const recipient = mockRecipients.find(
    (r: { id: number }) => r.id === parseInt(inheritDetailId, 10),
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="min-h-screen flex flex-col">
        {/* Form */}
        <div className="flex-1 flex flex-col gap-7 pt-6 pb-32">
          <RecipientHeader
            recipient={recipient!}
            onEdit={() => router.back()}
          />
          <NicknameInput value={nickname} onChange={setNickname} />
          <YearsInput value={yearsLater} onChange={setYearsLater} />
          <InheritanceMethodToggle value={method} onChange={setMethod} />
          {audioUrl ? (
            <div>
              <div className="flex justify-center w-full">
                <AudioPlayer audioUrl={audioUrl} />
              </div>

              <button
                type="button"
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl(null);
                }}
                className="pt-2 pr-4 flex items-center justify-end w-full gap-1.5 text-sm text-gray-500"
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
        </div>

        {/* Submit button */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full px-6.25 pb-8 bg-white pt-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0)]">
          <PrimaryButton
            onClick={handleSubmit}
            disabled={isSubmitting}
            label={isSubmitting ? "저장 중..." : "작성 완료"}
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
