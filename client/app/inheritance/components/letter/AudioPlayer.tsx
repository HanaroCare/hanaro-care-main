"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";

interface Props {
  audioUrl: string;
  bgColor?: string;
  buttonColor?: string;
  timeColor?: string;
  className?: string;
}

export default function AudioPlayer({
  audioUrl,
  bgColor = "bg-teal-50",
  buttonColor = "text-hana-green-700 fill-hana-green-700",
  timeColor = "text-gray-400",
  className = "px-6 pt-4",
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
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      className={`${bgColor} rounded-2xl flex flex-col justify-between ${className} pb-5 w-full h-38.75`}
    >
      {/* 진행바 */}
      <div className={`w-full h-1 bg-white rounded-full mt-7`}>
        <div
          className={`h-1 bg-hana-green-700 rounded-full w-full`}
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
      <div className="flex justify-center mt-1 mb-3">
        <button
          type="button"
          onClick={togglePlay}
          className="w-8 h-8 pb-2 rounded-full flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className={`w-7 h-7 ${buttonColor}`} />
          ) : (
            <Play className={`w-7 h-7 ${buttonColor}`} />
          )}
        </button>
      </div>
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
