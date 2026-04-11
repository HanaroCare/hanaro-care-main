"use client";

import { Mic, RotateCcw, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { RecordingState } from "../../types";
import AudioPlayer from "./AudioPlayer";

interface Props {
  onClose: () => void;
  onSave: (audioBlob: Blob) => void;
}

const MAX_SECONDS = 60;

export default function VoiceRecorderSheet({ onClose, onSave }: Props) {
  const [state, setState] = useState<RecordingState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m} : ${s}`;
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob));
      setState("recorded");
    };

    mediaRecorder.start();
    setState("recording");

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= MAX_SECONDS) {
          stopRecording();
          return MAX_SECONDS;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleMicButton = () => {
    if (state === "idle") startRecording();
    else if (state === "recording") stopRecording();
  };

  const handleReRecord = () => {
    setElapsed(0);
    setAudioUrl(null);
    setAudioBlob(null);
    setState("idle");
  };

  const handleSave = () => {
    if (audioBlob) onSave(audioBlob);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <div className="relative w-full bg-white rounded-t-3xl px-6 pt-6 pb-10 flex flex-col items-center gap-6">
        {/* 헤더 */}
        <div className="w-full flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900">
            녹음으로 대신하기
          </span>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* idle 상태 */}
        {state === "idle" && (
          <>
            <p className="text-sm text-center text-gray-500 leading-relaxed">
              아래 버튼을 눌러 목소리로
              <br />
              <span className="text-hana-green-700 font-medium">
                소중한 마음을 전달해보세요
              </span>
            </p>
            <p className="text-4xl font-bold text-gray-900 tracking-widest">
              {formatTime(elapsed)}
            </p>
            <p className="text-sm text-gray-400">최대 1분까지 녹음 가능해요</p>
            <button
              type="button"
              onClick={handleMicButton}
              className="w-20 h-20 rounded-full bg-hana-green-700 flex items-center justify-center hover:bg-hana-green-600 transition-colors"
            >
              <Mic className="w-8 h-8 text-white" strokeWidth={1.5} />
            </button>
            <p className="text-sm text-gray-400">눌러서 녹음 시작</p>
          </>
        )}

        {/* recording 상태 */}
        {state === "recording" && (
          <>
            <p className="text-sm text-center text-gray-500 leading-relaxed">
              녹음 중이에요.
              <br />
              <span className="text-red-400 font-medium">
                완료하려면 버튼을 다시 눌러주세요.
              </span>
            </p>
            <p className="text-4xl font-bold text-gray-900 tracking-widest">
              {formatTime(elapsed)}
            </p>
            <p className="text-sm text-gray-400">
              {MAX_SECONDS - elapsed}초 남음
            </p>
            <button
              type="button"
              onClick={handleMicButton}
              className="w-20 h-20 rounded-full bg-red-400 flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              <Square className="w-8 h-8 text-white fill-white" />
            </button>
            <p className="text-sm text-gray-400">녹음 중 · 눌러서 완료</p>
            <button
              type="button"
              className="w-full bg-red-300 rounded-xl p-3"
              onClick={onClose}
            >
              취소
            </button>
          </>
        )}

        {/* recorded 상태 */}
        {state === "recorded" && audioUrl && (
          <>
            <div className="w-full flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-hana-green-700 flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  음성 메시지
                </p>
                <p className="text-xs text-gray-400">
                  {formatTime(elapsed)} 녹음됨
                </p>
              </div>
            </div>

            {/* 오디오 플레이어 */}
            <AudioPlayer audioUrl={audioUrl} />

            <button
              type="button"
              onClick={handleReRecord}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              다시 녹음하기
            </button>

            <div className="w-full flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl bg-[#E9F8F9] text-hana-green-700 p-2 pr-0"
                onClick={onClose}
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-hana-green-700 hover:bg-hana-green-600 text-white p-2 pl-0"
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
