'use client';

import { Pause, Play } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
  audioUrl: string;
  bgColor?: string;
  buttonColor?: string;
  timeColor?: string;
  className?: string;
}

export default function AudioPlayer({
  audioUrl,
  bgColor = 'bg-teal-50',
  buttonColor = 'text-hana-green-700 fill-hana-green-700',
  timeColor = 'text-gray-400',
  className = 'px-6 pt-4',
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      className={`${bgColor} flex flex-col justify-between rounded-2xl ${className} h-38.75 w-full pb-5`}
    >
      {/* 진행바 */}
      <div className={`mt-7 h-1 w-full rounded-full bg-white`}>
        <div
          className={`h-1 w-full rounded-full bg-hana-green-700`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* 시간 */}
      <div className="flex items-center justify-between pt-1">
        <span className={`text-xs ${timeColor}`}>
          {formatTime(currentTime)}
        </span>
        <span className={`text-xs ${timeColor}`}>{formatTime(duration)}</span>
      </div>
      {/* 재생버튼 */}
      <div className="mt-1 mb-3 flex justify-center">
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-8 w-8 items-center justify-center rounded-full pb-2"
        >
          {isPlaying ? (
            <Pause className={`h-7 w-7 ${buttonColor}`} />
          ) : (
            <Play className={`h-7 w-7 ${buttonColor}`} />
          )}
        </button>
      </div>
      {/** biome-ignore lint/a11y/useMediaCaption: track 안 쓸래! */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
