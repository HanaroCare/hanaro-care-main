'use client';

import { ChevronLeft, X } from 'lucide-react';

interface MobileShellProps {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
  progress?: number; // 0-100
  showBottomNav?: boolean;
}

const NAV_ITEMS = [
  { label: '홈', icon: 'home' },
  { label: '자산 설계', icon: 'chart' },
  { label: '돌봄 지갑', icon: 'compass' },
  { label: 'My하나', icon: 'user' },
];

function HomeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const navIcons = [HomeIcon, ChartIcon, CompassIcon, UserIcon];

export default function MobileShell({
  title,
  onBack,
  onClose,
  children,
  progress,
  showBottomNav = true,
}: MobileShellProps) {
  return (
    <div className="flex h-full min-h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
        >
          {onBack && <ChevronLeft size={22} className="text-gray-700" />}
        </button>
        <span className="font-medium text-[15px] text-gray-800">{title}</span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
        >
          {onClose && <X size={20} className="text-gray-700" />}
        </button>
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mb-2 px-4">
          <div className="h-0.75 w-full rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{children}</div>

      {/* Bottom Nav */}
      {showBottomNav && (
        <div className="border-gray-100 border-t">
          <div className="flex">
            {NAV_ITEMS.map((item, i) => {
              const Icon = navIcons[i];
              return (
                <button
                  type="button"
                  key={item.label}
                  className={`flex flex-1 flex-col items-center gap-1 py-2.5 ${
                    i === 0 ? 'text-teal-600' : 'text-gray-400'
                  }`}
                >
                  <Icon />
                  <span className="text-[10px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
