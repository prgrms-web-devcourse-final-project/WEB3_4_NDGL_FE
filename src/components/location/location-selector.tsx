'use client';

import { useEffect, useRef, useState } from 'react';
import { LocationSearch } from './location-search';
import { useLocationStore } from '@/store/useLocationStore';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

declare global {
  interface Window {
    kakao: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

export const LocationSelector = () => {
  const { locations, addLocation, clearLocations } = useLocationStore();

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
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

  useEffect(() => {
    if (!map || !locations) return;

    markers.forEach((marker) => marker.setMap(null));

    const newMarkers = locations.map((place) => {
      const position = new window.kakao.maps.LatLng(
        place.latitude,
        place.longitude,
      );
      const marker = new window.kakao.maps.Marker({
        position,
        map,
      });
      return marker;
    });

    if (locations.length) {
      const lastPlace = locations[locations.length - 1];
      map.setCenter(
        new window.kakao.maps.LatLng(lastPlace.latitude, lastPlace.longitude),
      );
    }

    setMarkers(newMarkers);
  }, [locations, map]);

  const handlePlaceSelect = (place: any) => {
    addLocation({
      address: place.address_name,
      name: place.place_name,
      latitude: Number(place.y),
      longitude: Number(place.x),
      sequence: locations.length,
    });
  };

  return (
    <div className="space-y-3">
      <LocationSearch onSelect={handlePlaceSelect} />

      <div
        ref={mapRef}
        className="h-[300px] w-full overflow-hidden rounded-lg border bg-gray-100 shadow dark:bg-gray-700"
      >
        {!isMapLoaded && (
          <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-300">
            지도 로딩 중...
          </div>
        )}
      </div>

      <AnimatePresence>
        {locations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded bg-blue-50 p-3 shadow dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold">
                📍 선택된 위치들 ({locations.length})
              </div>
              <Button size="icon" variant="ghost" onClick={clearLocations}>
                <X className="size-4" />
              </Button>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {locations.map((place) => (
                <li
                  key={place.sequence}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {place.name} - {place.address}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
