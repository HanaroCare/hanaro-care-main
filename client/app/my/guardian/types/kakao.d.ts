declare namespace kakao.maps {
  // biome-ignore lint/suspicious/noShadowRestrictedNames: 카카오맵 SDK 타입 선언
  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Marker {
    constructor(options: MarkerOptions);
  }

  interface MapOptions {
    center: LatLng;
    level: number;
  }

  interface MarkerOptions {
    map: KakaoMap;
    position: LatLng;
    title?: string;
  }

  function load(callback: () => void): void;
}

declare namespace kakao.maps.services {
  interface GeocoderResult {
    address: {
      address_name: string;
    };
    road_address?: {
      address_name: string;
    };
    x: string;
    y: string;
  }

  interface PlaceResult {
    id: string;
    place_name: string;
    road_address_name: string;
    address_name: string;
    distance: string;
    phone: string;
    x: string;
    y: string;
  }

  class Geocoder {
    coord2Address(
      lng: number,
      lat: number,
      callback: (result: GeocoderResult[], status: Status) => void,
    ): void;
    addressSearch(
      address: string,
      callback: (result: GeocoderResult[], status: Status) => void,
    ): void;
  }

  class Places {
    keywordSearch(
      keyword: string,
      callback: (result: PlaceResult[], status: Status) => void,
      options?: PlacesSearchOptions,
    ): void;
  }

  interface PlacesSearchOptions {
    location?: kakao.maps.LatLng;
    sort?: SortBy;
  }

  enum Status {
    OK = 'OK',
    ZERO_RESULT = 'ZERO_RESULT',
    ERROR = 'ERROR',
  }

  enum SortBy {
    ACCURACY = 'accuracy',
    DISTANCE = 'distance',
  }
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}
