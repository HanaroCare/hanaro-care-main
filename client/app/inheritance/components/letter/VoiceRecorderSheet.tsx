'use client';

import { Mic, RotateCcw, Square, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { RecordingState } from '../../types';
import AudioPlayer from './AudioPlayer';

interface Props {
  onClose: () => void;
  onSave: (audioBlob: Blob) => void;
}

const MAX_SECONDS = 60;

export default function VoiceRecorderSheet({ onClose, onSave }: Props) {
  const [state, setState] = useState<RecordingState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m} : ${s}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setState('recorded');
      };

      mediaRecorder.start();
      setState('recording');

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= MAX_SECONDS) {
            stopRecording();
            return MAX_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('마이크 접근 실패:', error);
      alert('마이크 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleMicButton = () => {
    if (state === 'idle') startRecording();
    else if (state === 'recording') stopRecording();
  };

  const handleReRecord = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setElapsed(0);
    setAudioUrl(null);
    setAudioBlob(null);
    setState('idle');
  };

  const handleSave = () => {
    if (audioBlob) onSave(audioBlob);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <div className="relative flex w-full flex-col items-center gap-6 rounded-t-3xl bg-white px-6 pt-6 pb-10">
        {/* 헤더 */}
        <div className="flex w-full items-center justify-between">
          <span className="font-semibold text-base text-gray-900">
            녹음으로 대신하기
          </span>
          <button type="button" onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* idle 상태 */}
        {state === 'idle' && (
          <>
            <p className="text-center text-gray-500 text-sm leading-relaxed">
              아래 버튼을 눌러 목소리로
              <br />
              <span className="font-medium text-hana-green-700">
                소중한 마음을 전달해보세요
              </span>
            </p>
            <p className="font-bold text-4xl text-gray-900 tracking-widest">
              {formatTime(elapsed)}
            </p>
            <p className="text-gray-400 text-sm">최대 1분까지 녹음 가능해요</p>
            <button
              type="button"
              onClick={handleMicButton}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-hana-green-700 transition-colors hover:bg-hana-green-600"
            >
              <Mic className="h-8 w-8 text-white" strokeWidth={1.5} />
            </button>
            <p className="text-gray-400 text-sm">눌러서 녹음 시작</p>
          </>
        )}

        {/* recording 상태 */}
        {state === 'recording' && (
          <>
            <p className="text-center text-gray-500 text-sm leading-relaxed">
              녹음 중이에요.
              <br />
              <span className="font-medium text-red-400">
                완료하려면 버튼을 다시 눌러주세요.
              </span>
            </p>
            <p className="font-bold text-4xl text-gray-900 tracking-widest">
              {formatTime(elapsed)}
            </p>
            <p className="text-gray-400 text-sm">
              {MAX_SECONDS - elapsed}초 남음
            </p>
            <button
              type="button"
              onClick={handleMicButton}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-red-400 transition-colors hover:bg-red-500"
            >
              <Square className="h-8 w-8 fill-white text-white" />
            </button>
            <p className="text-gray-400 text-sm">녹음 중 · 눌러서 완료</p>
            <button
              type="button"
              className="w-full rounded-xl bg-red-300 p-3"
              onClick={onClose}
            >
              취소
            </button>
          </>
        )}

        {/* recorded 상태 */}
        {state === 'recorded' && audioUrl && (
          <>
            <div className="flex w-full items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hana-green-700">
                <Mic className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  음성 메시지
                </p>
                <p className="text-gray-400 text-xs">
                  {formatTime(elapsed)} 녹음됨
                </p>
              </div>
            </div>

            {/* 오디오 플레이어 */}
            <AudioPlayer audioUrl={audioUrl} />

            <button
              type="button"
              onClick={handleReRecord}
              className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
              다시 녹음하기
            </button>

            <div className="flex w-full gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl bg-[#E9F8F9] p-2 pr-0 text-hana-green-700"
                onClick={onClose}
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-hana-green-700 p-2 pl-0 text-white hover:bg-hana-green-600"
                onClick={handleSave}
              >
                저장하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
