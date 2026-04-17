"use client";

import { useEffect, useRef } from "react";

interface KakaoAddressMapProps {
  address: string;
  height?: string;
}

export default function KakaoAddressMap({
  address,
  height = "257px",
}: KakaoAddressMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!address || !mapRef.current) return;

    const loadMap = () => {
      if (!mapRef.current) return;
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(
        address,
        (
          result: kakao.maps.services.GeocoderResult[],
          status: kakao.maps.services.Status,
        ) => {
          if (
            status === window.kakao.maps.services.Status.OK &&
            mapRef.current
          ) {
            const coords = new window.kakao.maps.LatLng(
              Number(result[0].y),
              Number(result[0].x),
            );
            const map = new window.kakao.maps.Map(
              mapRef.current as HTMLElement,
              {
                center: coords,
                level: 3,
              },
            );
            new window.kakao.maps.Marker({
              map,
              position: coords,
              title: address,
            });
          }
        },
      );
    };

    // 이미 로드된 경우
    if (window.kakao?.maps?.services) {
      loadMap();
      return;
    }

    // 스크립트 로드 중인 경우 (다른 컴포넌트가 이미 붙임)
    if (document.querySelector('script[src*="dapi.kakao.com"]')) {
      const interval = setInterval(() => {
        if (window.kakao?.maps?.services) {
          clearInterval(interval);
          loadMap();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    // 스크립트 없는 경우 새로 로드
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => window.kakao.maps.load(loadMap);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [address]);

  return <div ref={mapRef} style={{ width: "100%", height }} />;
}
