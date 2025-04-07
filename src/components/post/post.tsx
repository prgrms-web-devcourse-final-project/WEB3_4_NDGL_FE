import { motion } from "motion/react";
import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/query-key";
import { getPost } from "@/services/post.service";
import { Skeleton } from "@/components/ui/skeleton";

const KAKAO_MAP_SCRIPT_ID = "kakao-map-script";

export const Post = () => {
  const params = useParams<{ postId: string }>();
  const postId = params.postId ?? "";

  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEY.POST.DETAIL(postId),
    queryFn: () => getPost(postId),
    enabled: postId !== "",
    select: (res) => res.data.data,
  });

  useEffect(() => {
    if (!post || !mapRef.current) return;

    const loadScriptAndInitMap = () => {
      const initMap = () => {
        if (!window.kakao || !window.kakao.maps || !mapRef.current) return;

        window.kakao.maps.load(() => {
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(
              post.locations[0].latitude,
              post.locations[0].longitude
            ),
            level: 5,
          });

          post.locations.forEach((loc) => {
            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(
                loc.latitude,
                loc.longitude
              ),
              map,
            });

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:6px;">${loc.name}</div>`,
            });

            window.kakao.maps.event.addListener(marker, "mouseover", () => {
              infowindow.open(map, marker);
            });

            window.kakao.maps.event.addListener(marker, "mouseout", () => {
              infowindow.close();
            });
          });

          setIsMapLoaded(true);
        });
      };

      if (!document.getElementById(KAKAO_MAP_SCRIPT_ID)) {
        const script = document.createElement("script");
        script.id = KAKAO_MAP_SCRIPT_ID;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
          import.meta.env.VITE_KAKAO_MAP_KEY
        }&libraries=services&autoload=false`;
        script.onload = initMap;

        document.head.appendChild(script);
      } else if (window.kakao && window.kakao.maps) {
        initMap();
      } else {
        document
          .getElementById(KAKAO_MAP_SCRIPT_ID)
          ?.addEventListener("load", initMap);
      }
    };

    loadScriptAndInitMap();
  }, [post]);

  if (isLoading)
    return (
      <div className="container mx-auto py-10 space-y-6">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-10 w-1/3 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );

  if (isError || !post)
    return (
      <div className="container py-10 text-center text-red-500">
        게시글을 불러오는 중 오류가 발생했습니다.
      </div>
    );
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-10 space-y-8"
    >
      <div className="relative">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-[400px] rounded-xl object-cover shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-white text-4xl font-bold drop-shadow-lg line-clamp-2 overflow-hidden">
            {post.title}
          </h1>
          <div className="flex gap-3 mt-3">
            {post.hashtags.map((tag) => (
              <span
                key={tag.name}
                className="px-3 py-1 bg-indigo-600/90 rounded-full text-sm text-white shadow"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          ref={mapRef}
          className="h-[400px] w-full rounded-xl border overflow-hidden shadow-lg"
        >
          {!isMapLoaded && (
            <div className="flex h-full items-center justify-center text-gray-500">
              지도 로딩 중...
            </div>
          )}
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-2">관련 위치들</h2>
          {post.locations.map((loc, idx) => (
            <motion.div
              key={loc.sequence}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-blue-50 dark:bg-gray-800 rounded-xl shadow"
            >
              <h3 className="font-semibold text-lg">{loc.name}</h3>
              <p className="text-sm text-muted-foreground">{loc.address}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
