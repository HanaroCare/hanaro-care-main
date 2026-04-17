"use client";

import { useRef, useEffect, useState } from "react";

interface DayPickerProps {
  value: number | null;
  onChange: (day: number) => void;
  disabled?: boolean;
}

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
const ITEM_HEIGHT = 44;

export default function DayPicker({
  value,
  onChange,
  disabled,
}: DayPickerProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(value ?? 15);
  const isScrolling = useRef(false);

  useEffect(() => {
    if (!listRef.current) return;
    const target = value ?? 15;
    setSelected(target);
    isScrolling.current = true;
    listRef.current.style.scrollBehavior = "auto";
    listRef.current.scrollTop = (target - 1) * ITEM_HEIGHT;
    setTimeout(() => {
      isScrolling.current = false;
    }, 100);
  }, [value]);

  const handleScroll = () => {
    if (!listRef.current || isScrolling.current) return;
    const index = Math.round(listRef.current.scrollTop / ITEM_HEIGHT);
    const day = DAYS[Math.min(Math.max(index, 0), DAYS.length - 1)];
    setSelected(day);
    onChange(day);
  };

  return (
    <div className="relative w-full h-[132px] overflow-hidden">
      <div className="absolute left-0 right-0 top-[44px] h-[44px] bg-hana-green-50 rounded-xl pointer-events-none z-0" />
      <div className="absolute top-0 left-0 right-0 h-[44px] bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-[44px] bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll"
        style={{
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          scrollBehavior: "auto",
        }}
      >
        <div style={{ height: ITEM_HEIGHT }} />
        {DAYS.map((day) => (
          <div
            key={day}
            style={{ height: ITEM_HEIGHT, scrollSnapAlign: "center" }}
            className={`relative z-20 flex items-center justify-center transition-all ${
              selected === day
                ? "text-hana-green-700 font-bold text-xl"
                : "text-hana-black-400 text-base font-medium"
            }`}
          >
            {day}일
          </div>
        ))}
        <div style={{ height: ITEM_HEIGHT }} />
      </div>
    </div>
  );
}
