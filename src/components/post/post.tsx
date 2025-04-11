import { motion } from "motion/react";
import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/query-key";
import { deletePost, getPost, likePost } from "@/services/post.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { DotsIcon } from "../ui/icons";
import { useModalStore } from "@/store/useModalStore";
import { IMAGE } from "@/constants/img";
import { follow } from "@/services/user.service";
import { toast } from "sonner";
import { AxiosError } from "axios";

const KAKAO_MAP_SCRIPT_ID = "kakao-map-script";

export const Post = () => {
  const router = useNavigate();
  const params = useParams<{ postId: string }>();
  const postId = params.postId ?? "";

  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { user } = useUser();

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

  const { mutate: likePostMutation } = useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.DETAIL(postId),
      });
    },
  });

  const { mutate: followMutation } = useMutation({
    mutationFn: (userId: string) => follow(userId),
    onSuccess: () => {
      toast.success("팔로우 성공");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.DETAIL(postId),
      });
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message: string }).message;
      toast.error(errorMessage ?? "follow Error,,,");
    },
  });
  // const { mutate: unFollowMutation } = useMutation({
  //   mutationFn: () => unFollow(user?.userId.toString() ?? ""),
  //   onSuccess: () => {
  //     toast.success("언팔로우 성공");
  //     queryClient.invalidateQueries({
  //       queryKey: QUERY_KEY.POST.DETAIL(postId),
  //     });
  //   },
  // });

  const { mutate: deletePostMutation } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.DEFAULT,
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.POPULAR,
        type: "all",
      });
      router("/");
    },
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

  const handleLike = () => {
    likePostMutation();
  };

  const handleDeleteClick = async () => {
    const confirmed = await useModalStore.getState().onOpen("confirm");

    if (confirmed) {
      deletePostMutation();
    } else {
      console.log("사용자가 취소하였습니다.");
    }
  };

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
          src={post.thumbnail || IMAGE.NO_IMG}
          alt={post.title}
          className="w-full h-[400px] rounded-xl object-cover shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-white text-2xl break-words md:text-4xl font-bold drop-shadow-lg line-clamp-2 w-full overflow-hidden">
            {post.title}
          </h1>
          <div className="w-full flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 rounded-full py-2 px-4 shadow backdrop-blur-sm cursor-pointer"
                onClick={handleLike}
              >
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-sm">
                  {post.likeCount}{" "}
                  <span className="hidden md:inline">좋아요</span>
                </span>
              </motion.button>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger>
                  <DotsIcon
                    className="cursor-pointer size-8 p-1 bg-foreground/30 border rounded-full"
                    pathClassName="fill-background"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {user && user.userId === post.authorId && (
                    <DropdownMenuItem
                      onClick={() =>
                        router(`/post/create?postid=${postId}&mode=edit`)
                      }
                      className="cursor-pointer"
                    >
                      수정
                    </DropdownMenuItem>
                  )}
                  {user && user.userId === post.authorId && (
                    <DropdownMenuItem
                      onClick={() => {
                        setDropdownOpen(false);
                        handleDeleteClick();
                      }}
                      className="cursor-pointer text-destructive"
                    >
                      삭제
                    </DropdownMenuItem>
                  )}
                  {user && user.userId !== post.authorId && (
                    <DropdownMenuItem
                      onClick={() => {
                        followMutation(post.authorId.toString());
                      }}
                      className="cursor-pointer"
                    >
                      팔로우
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer">
                    신고
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <div
        className="prose prose-lg max-w-full dark:prose-invert break-words"
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
