import type { RefObject } from 'react';
import type { Notary } from '../types/types';

export const initMap = (
  mapRef: RefObject<HTMLDivElement | null>,
  lat: number,
  lng: number,
  setLocationLabel: (label: string) => void,
  setNotaries: (notaries: Notary[]) => void,
  setLoading: (loading: boolean) => void,
  mapInstanceRef: RefObject<kakao.maps.Map | null>,
) => {
  const geocoder = new window.kakao.maps.services.Geocoder();
  geocoder.coord2Address(
    lng,
    lat,
    (
      result: kakao.maps.services.Coord2AddressResult[],
      status: kakao.maps.services.Status,
    ) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const addr =
          result[0].road_address?.address_name ??
          result[0].address.address_name;
        setLocationLabel(addr);
      }
    },
  );

  if (!mapRef.current) return;
  const map = new window.kakao.maps.Map(mapRef.current, {
    center: new window.kakao.maps.LatLng(lat, lng),
    level: 5,
  });
  mapInstanceRef.current = map;

  new window.kakao.maps.Marker({
    map,
    position: new window.kakao.maps.LatLng(lat, lng),
    title: '현재 위치',
  });

  const ps = new window.kakao.maps.services.Places();
  
ps.keywordSearch(
  '공증인 사무소',
  (data, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const top3: Notary[] = data.slice(0, 3).map((place) => ({
        id: place.id,
        name: place.place_name,
        address: place.road_address_name || place.address_name,
        distance: place.distance
          ? `${(Number(place.distance) / 1000).toFixed(1)}km`
          : '-',
        phone: place.phone,
        lat: Number(place.y),
        lng: Number(place.x),
      }));

      setNotaries(top3);
      setLoading(false);

      top3.forEach((notary) => {
        new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(notary.lat, notary.lng),
          title: notary.name,
        });
      });

      return;
    }

    console.warn('Places search failed:', status);

    setNotaries([]);
    setLoading(false);
  },
  {
    location: new window.kakao.maps.LatLng(lat, lng),
    sort: window.kakao.maps.services.SortBy.DISTANCE,
  },
);
};
