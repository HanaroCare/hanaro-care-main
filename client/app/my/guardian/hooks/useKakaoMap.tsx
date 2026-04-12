import { type RefObject, useEffect, useState } from 'react';
import type { Notary } from '../types/types';
import { initMap } from '../utils/initMap';

export const useKakaoMap = (
  mapRef: RefObject<HTMLDivElement | null>,
  mapInstanceRef: RefObject<kakao.maps.Map | null>,
  selectedIdx: number | null,
) => {
  const [notaries, setNotaries] = useState<Notary[]>([]);
  const [locationLabel, setLocationLabel] = useState('위치 확인 중...');
  const [loading, setLoading] = useState(true);

  // 지도 초기화 및 공증인 검색
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 한 번만 실행
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            initMap(
              mapRef,
              pos.coords.latitude,
              pos.coords.longitude,
              setLocationLabel,
              setNotaries,
              setLoading,
              mapInstanceRef,
            ),
          () => {
            setLocationLabel('서울 성동구 아차산로 100');
            initMap(
              mapRef,
              37.5505,
              127.0435,
              setLocationLabel,
              setNotaries,
              setLoading,
              mapInstanceRef,
            );
          },
        );
      });
    };

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  // 선택된 사무소로 지도 이동
  useEffect(() => {
    if (selectedIdx === null || !mapInstanceRef.current) return;
    const notary = notaries[selectedIdx];
    mapInstanceRef.current.setCenter(
      new window.kakao.maps.LatLng(notary.lat, notary.lng),
    );
  }, [selectedIdx, notaries, mapInstanceRef]);

  return { notaries, locationLabel, loading };
};
