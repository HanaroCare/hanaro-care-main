declare namespace kakao.maps {
  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
  }

  interface MapOptions {
    center: LatLng;
    level: number;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Marker {
    constructor(options: MarkerOptions);
  }

  interface MarkerOptions {
    map: Map;
    position: LatLng;
    title: string;
  }

  function load(callback: () => void): void;

  namespace services {
    class Geocoder {
      addressSearch(
        address: string,
        callback: (result: GeocoderResult[], status: Status) => void
      ): void;
      coord2Address(
        x: number,
        y: number,
        callback: (result: Coord2AddressResult[], status: Status) => void
      ): void;
      transCoord(
        x: number,
        y: number,
        callback: (result: TransCoordResult[], status: Status) => void,
        options: {
          input_coord: CoordsType;
          output_coord: CoordsType;
        }
      ): void;
    }

    interface GeocoderResult {
      x: string;
      y: string;
      address: {
        address_name: string;
      };
      road_address: {
        address_name: string;
      } | null;
    }

    interface Coord2AddressResult {
      address: {
        address_name: string;
        region_1depth_name: string;
        region_2depth_name: string;
        region_3depth_name: string;
      };
      road_address: {
        address_name: string;
        region_1depth_name: string;
        region_2depth_name: string;
        region_3depth_name: string;
      } | null;
    }

    interface TransCoordResult {
      x: number;
      y: number;
    }

    class Places {
      keywordSearch(
        keyword: string,
        callback: (result: PlaceResult[], status: Status) => void,
        options?: {
          location?: LatLng;
          sort?: SortBy;
        }
      ): void;
    }

    interface PlaceResult {
      id: string;
      place_name: string;
      address_name: string;
      road_address_name: string;
      x: string;
      y: string;
      distance: string;
      phone: string;
    }

    enum Status {
      OK,
      ZERO_RESULT,
      ERROR
    }

    enum SortBy {
      DISTANCE,
      ACCURACY
    }

    type CoordsType = 'WGS84' | 'WCONGNAMUL' | 'CONGNAMUL' | 'WTM' | 'TM';
  }
}

interface Window {
  kakao: typeof kakao;
}
