import { motion } from "motion/react";
import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/query-key";
import { deletePost, getPost, likePost } from "@/services/post.service";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
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
import { follow, hasFollow, unFollow } from "@/services/user.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";

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
  const { onOpen } = useModalStore();

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
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.LIST("like", ""),
        type: "all",
      });
    },
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const locationsToShow = isExpanded
    ? post?.locations
    : post?.locations.slice(0, 4);

  const { data: isFollowed } = useQuery({
    queryKey: QUERY_KEY.USER.FOLLOW(post?.authorId?.toString() ?? ""),
    queryFn: () => hasFollow(post?.authorId?.toString() ?? ""),
    enabled: !!post?.authorId,
    select: (res) => res.data.data.isFollowed,
  });

  const { mutate: followMutation } = useMutation({
    mutationFn: (userId: string) => follow(userId),
    onSuccess: () => {
      toast.success("팔로우 성공");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.DETAIL(postId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.LIST("follow", ""),
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.USER.FOLLOW(post?.authorId?.toString() ?? ""),
        type: "all",
      });
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message: string }).message;
      toast.error(errorMessage ?? "follow Error,,,");
    },
  });
  const { mutate: unFollowMutation } = useMutation({
    mutationFn: (userId: string) => unFollow(userId),
    onSuccess: () => {
      toast.success("언팔로우 성공");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.DETAIL(postId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.LIST("follow", ""),
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.USER.FOLLOW(post?.authorId?.toString() ?? ""),
        type: "all",
      });
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message: string }).message;
      toast.error(errorMessage ?? "follow Error,,,");
    },
  });

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
            <div className="flex gap-3 mt-3 w-1/2 overflow-x-auto pb-2 scrollbar-hide">
              {post.hashtags.map((tag) => (
                <span
                  key={tag.name}
                  className="whitespace-nowrap px-3 py-1 bg-indigo-600/90 rounded-full text-sm text-white shadow"
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
                <Heart
                  className={cn(
                    "w-5 h-5 text-red-500",
                    post.likeStatus ? "fill-red-500" : "fill-transparent"
                  )}
                />
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
                  {user && (
                    <DropdownMenuItem
                      onClick={() =>
                        router(`/post?mode=user&userid=${post.authorId}`)
                      }
                      className="cursor-pointer"
                    >
                      {post.authorName}님 게시글
                    </DropdownMenuItem>
                  )}
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
                        if (isFollowed) {
                          unFollowMutation(post.authorId.toString());
                        } else {
                          followMutation(post.authorId.toString());
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {isFollowed ? "언팔로우" : "팔로우"}
                    </DropdownMenuItem>
                  )}
                  {user && user.userId !== post.authorId && (
                    <DropdownMenuItem
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpen("report", {
                          type: "post",
                          postId: post.id.toString(),
                        });
                      }}
                      className="cursor-pointer"
                    >
                      신고
                    </DropdownMenuItem>
                  )}
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
          {locationsToShow &&
            locationsToShow.map((loc, idx) => (
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

          {post.locations.length > 4 && (
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline mt-2"
            >
              {isExpanded ? (
                <>
                  접기 <ChevronUp className="w-5 h-5" />
                </>
              ) : (
                <>
                  더 보기 ({post.locations.length - 4}개 더)
                  <ChevronDown className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
