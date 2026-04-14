'use client';

import { Clock, MapPin, Phone } from 'lucide-react';
import { useRef, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { useKakaoMap } from '../hooks/useKakaoMap';

type Props = {
  onNext: () => void;
};

const isOpen = () => {
  const now = new Date();
  const day = now.getDay();
  if (day === 0 || day === 6) return false;
  const current = now.getHours() + now.getMinutes() / 60;
  return current >= 9 && current < 18;
};

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

export default function Step6FindNotary({ onNext }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<kakao.maps.Map | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const { notaries, locationLabel, loading } = useKakaoMap(
    mapRef,
    mapInstanceRef,
    selectedIdx,
  );

  const handleNavigate = () => {
    if (selectedIdx === null) return;
    const address = notaries[selectedIdx].address;
    window.open(
      `https://map.kakao.com/link/search/${encodeURIComponent(address)}`,
      '_blank',
    );
  };

  return (
    <div>
      <div className="pt-6 pb-4">
        <div className="mb-5">
          <h1 className="font-bold text-[24px] text-gray-900 leading-snug">
            가까운 공증인
            <br />
            사무소를 찾았어요
          </h1>
          <p className="mt-1 text-[13px] text-gray-400">
            현재 위치 기준 가까운 순으로 안내해드려요
          </p>
        </div>

        {/* Location chip */}
        <div className="mb-4 flex items-center justify-between rounded-xl bg-teal-50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-teal-500" />
            <span className="truncate font-medium text-[13px] text-teal-700">
              {locationLabel} 기준
            </span>
          </div>
        </div>

        {/* 지도 */}
        <div
          ref={mapRef}
          style={{ width: '100%', height: '144px' }}
          className="mb-5 rounded-2xl"
        />

        {/* Notary list */}
        <p className="mb-3 font-medium text-[13px] text-gray-500">
          근처 공증인 사무소
        </p>

        {loading ? (
          <p className="py-6 text-center text-[13px] text-gray-400">
            검색 중...
          </p>
        ) : (
          <div className="mb-4 space-y-3">
            {notaries.map((notary, idx) => {
              const isSelected = selectedIdx === idx;
              const open = isOpen();
              return (
                <button
                  type="button"
                  key={notary.name}
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-gray-100 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-[14px] text-gray-800">
                        {notary.name}
                      </p>
                      <p className="mt-0.5 text-[12px] text-gray-400">
                        {notary.address}
                      </p>
                    </div>
                    <div className="ml-2 flex items-center gap-1">
                      <MapPin size={11} className="shrink-0 text-teal-500" />
                      <span className="font-medium text-[12px] text-teal-600">
                        {notary.distance}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className="text-gray-400" />
                      <span
                        className={`font-medium text-[10px] ${
                          open ? 'text-green-500' : 'text-red-400'
                        }`}
                      >
                        {open ? '● 영업중' : '● 영업종료'}
                      </span>
                    </div>
                    {notary.phone && (
                      <a
                        href={`tel:${notary.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-[12px] text-gray-600 transition-colors hover:bg-gray-200"
                      >
                        <Phone size={11} />
                        전화
                      </a>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <PrimaryButton
        onClick={handleNavigate}
        label={'선택한 사무소로 길찾기'}
        variant={selectedIdx === null ? 'disabled' : 'primary'}
        disabled={selectedIdx === null}
        className="mb-2 w-full"
      />
      <PrimaryButton
        variant="secondary"
        onClick={onNext}
        label={'완료하기'}
        className="w-full"
      />
    </div>
  );
}
