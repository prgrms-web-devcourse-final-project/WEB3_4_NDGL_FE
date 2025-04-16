import { useOutsideClick } from "@/hooks/useOutsideClick";
import { BlogType } from "@/types/blog.type";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useId, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { follow, unFollow } from "@/services/user.service";
import { toast } from "sonner";
import { QUERY_KEY } from "@/lib/query-key";
import { AxiosError } from "axios";

export const Blog = ({ blogs }: { blogs: BlogType[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const router = useNavigate();

  const [active, setActive] = useState<(typeof blogs)[number] | boolean | null>(
    null
  );

  const queryClient = useQueryClient();

  const { mutate: followMutation } = useMutation({
    mutationFn: (userId: string) => follow(userId),
    onSuccess: () => {
      toast.success("팔로우 성공");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.BLOG.DEFAULT,
        type: "all",
      });
      setActive(false);
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
        queryKey: QUERY_KEY.BLOG.DEFAULT,
        type: "all",
      });
      setActive(false);
    },
    onError: (err: AxiosError) => {
      const errorMessage = (err.response?.data as { message: string }).message;
      toast.error(errorMessage ?? "follow Error,,,");
    },
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`post-${active.id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <div>
                <div className="flex justify-between items-start p-4 gap-2">
                  <div className="min-w-0 flex-1">
                    <motion.h3
                      layoutId={`title-${active.id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200 line-clamp-1 break-words"
                    >
                      {active.blogName}
                    </motion.h3>
                    <motion.p
                      layoutId={`author-${active.id}`}
                      className="text-neutral-600 dark:text-neutral-400 break-words"
                    >
                      {active.nickname}
                    </motion.p>
                  </div>
                  <div className="shrink-0">
                    <motion.span
                      layoutId={`button-${active.id}`}
                      className="px-4 py-3 text-sm rounded-full font-bold block whitespace-nowrap text-center"
                    >
                      {active.isFollowed ? (
                        <Button
                          variant="link"
                          onClick={() => unFollowMutation(active.id.toString())}
                          className="cursor-pointer"
                        >
                          언팔로우
                        </Button>
                      ) : (
                        <Button
                          variant="link"
                          onClick={() => followMutation(active.id.toString())}
                          className="cursor-pointer"
                        >
                          팔로우
                        </Button>
                      )}
                    </motion.span>
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 overflow-auto dark:text-neutral-400 break-words [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {active.posts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center gap-2.5 justify-between"
                      >
                        <span className="font-bold text-sm">{post.title}</span>
                        <Button
                          onClick={() => {
                            document.body.style.overflow = "auto";
                            router(`/post/${post.id}`);
                          }}
                          variant="link"
                          className="cursor-pointer"
                        >
                          게시글 확인
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {blogs.map((post) => (
          <motion.div
            layoutId={`post-${post.id}`}
            key={`post-${post.id}`}
            onClick={() => setActive(post)}
            className="p-4 flex flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer w-full gap-4"
          >
            <div className="flex-1 min-w-0 break-words">
              <motion.h3
                layoutId={`title-${post.id}`}
                className="font-medium text-neutral-800 dark:text-neutral-200 line-clamp-1"
              >
                {post.blogName}
              </motion.h3>
              <motion.p
                layoutId={`description-${post.id}`}
                className="text-neutral-600 dark:text-neutral-400 line-clamp-2 md:text-base text-sm"
              >
                {post.nickname}
              </motion.p>
            </div>
            <motion.button
              layoutId={`button-${post.id}`}
              className="py-3 px-4 cursor-pointer text-xs rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black shrink-0 whitespace-nowrap"
            >
              <ArrowRight className="block size-4 md:hidden" />
              <span className="md:inline hidden">자세히 보기</span>
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
};

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
