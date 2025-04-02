'use client';

import { useState } from 'react';

interface LocationSearchProps {
  onSelect: (place: KakaoPlace) => void;
}

interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  x: string;
  y: string;
}

export const LocationSearch = ({ onSelect }: LocationSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchPlaces = () => {
    if (!window.kakao?.maps?.services) return;

    setIsLoading(true);
    setSearched(true);
    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(query, (data: KakaoPlace[], status: string) => {
      setIsLoading(false);
      if (status === window.kakao.maps.services.Status.OK) {
        setResults(data);
      } else {
        setResults([]);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded border bg-white px-3 py-2 text-sm placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
          placeholder="지역을 검색하세요"
          onKeyDown={(e) => e.key === 'Enter' && searchPlaces()}
        />
        <button
          onClick={searchPlaces}
          disabled={isLoading || query.trim().length === 0}
          className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? '검색 중...' : '검색'}
        </button>
      </div>

      <ul className="max-h-48 overflow-auto rounded border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {results.length > 0 ? (
          results.map((place) => (
            <li
              key={place.id}
              className="cursor-pointer p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onSelect(place)}
            >
              <div className="font-medium text-gray-800 dark:text-gray-100">
                {place.place_name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {place.address_name}
              </div>
            </li>
          ))
        ) : searched && !isLoading ? (
          <div className="p-2 text-center text-sm text-gray-500 dark:text-gray-400">
            검색 결과가 없습니다.
          </div>
        ) : null}
      </ul>
    </div>
  );
};
