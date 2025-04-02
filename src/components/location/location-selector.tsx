'use client';

import { useEffect, useRef, useState } from 'react';
import { LocationSearch } from './location-search';

declare global {
  interface Window {
    kakao: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

interface SelectedPlace {
  address: string;
  latitude: number;
  longitude: number;
}

export const LocationSelector = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [marker, setMarker] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null,
  );
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!window.kakao?.maps || !mapRef.current) return;

    window.kakao.maps.load(() => {
      const center = new window.kakao.maps.LatLng(37.5665, 126.978);
      const mapInstance = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 5,
      });

      setMap(mapInstance);
      setIsMapLoaded(true);
    });
  }, []);

  const handlePlaceSelect = (
    place: any /* eslint-disable-line @typescript-eslint/no-explicit-any */,
  ) => {
    if (!map) return;

    const position = new window.kakao.maps.LatLng(place.y, place.x);
    map.setCenter(position);

    if (marker) marker.setMap(null);

    const newMarker = new window.kakao.maps.Marker({
      position,
      map,
    });

    setMarker(newMarker);
    setSelectedPlace({
      address: place.address_name,
      latitude: Number(place.y),
      longitude: Number(place.x),
    });
  };

  return (
    <div className="space-y-3">
      <LocationSearch onSelect={handlePlaceSelect} />

      <div
        ref={mapRef}
        className={`h-[300px] w-full overflow-hidden rounded-lg border bg-gray-100 shadow dark:bg-gray-700`}
      >
        {!isMapLoaded && (
          <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-300">
            지도 로딩 중...
          </div>
        )}
      </div>

      {selectedPlace && (
        <div className="rounded bg-blue-50 p-3 text-sm shadow dark:bg-gray-800">
          📍 <span className="font-semibold">선택한 위치:</span>{' '}
          {selectedPlace.address}
        </div>
      )}
    </div>
  );
};
