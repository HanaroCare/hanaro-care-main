'use client';

import { useEffect, useRef } from 'react';

const CENTER = { lat: 37.5505, lng: 127.0435 };

interface KakaoMapProps {
  selectedIdx: number | null;
  notaries: {
    name: string;
    address: string;
  }[];
}

export default function KakaoMap({ selectedIdx, notaries }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 한 번만 실행
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(CENTER.lat, CENTER.lng),
          level: 4,
        });
        mapInstanceRef.current = map;

        const geocoder = new window.kakao.maps.services.Geocoder();
        notaries.forEach((notary) => {
          geocoder.addressSearch(
            notary.address,
            (
              result: kakao.maps.services.GeocoderResult[],
              status: kakao.maps.services.Status,
            ) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(
                  Number(result[0].y),
                  Number(result[0].x),
                );
                const marker = new window.kakao.maps.Marker({
                  map,
                  position: coords,
                  title: notary.name,
                });
                markersRef.current.push(marker);
              }
            },
          );
        });
      });
    };

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (selectedIdx === null || !mapInstanceRef.current) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(
      notaries[selectedIdx].address,
      (
        result: kakao.maps.services.GeocoderResult[],
        status: kakao.maps.services.Status,
      ) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(
            Number(result[0].y),
            Number(result[0].x),
          );
          mapInstanceRef.current?.setCenter(coords);
        }
      },
    );
  }, [selectedIdx, notaries]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '144px' }}
      className="mb-5 rounded-2xl"
    />
  );
}
