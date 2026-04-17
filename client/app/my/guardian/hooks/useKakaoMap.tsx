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

  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 한 번만 실행
  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!appKey) {
      setLocationLabel('지도 설정을 확인해주세요.');
      setLoading(false);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;
    script.onerror = () => {
      setLocationLabel('지도를 불러오지 못했어요.');
      setLoading(false);
    };
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

  useEffect(() => {
    if (selectedIdx === null || !mapInstanceRef.current) return;
    const notary = notaries[selectedIdx];
    mapInstanceRef.current.setCenter(
      new window.kakao.maps.LatLng(notary.lat, notary.lng),
    );
  }, [selectedIdx, notaries, mapInstanceRef]);

  return { notaries, locationLabel, loading };
};
