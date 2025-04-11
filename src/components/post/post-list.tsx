import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { PostType } from "@/types/post.type";
import DOMPurify from "dompurify";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

type PostListProps = {
  posts: PostType[];
};

export const PostList = ({ posts }: PostListProps) => {
  const [active, setActive] = useState<(typeof posts)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

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
          <div className="fixed inset-0  grid place-items-center z-[100]">
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
              <motion.div layoutId={`image-${active.id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.thumbnail}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4 gap-2">
                  <div className="min-w-0 flex-1">
                    <motion.h3
                      layoutId={`title-${active.id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200 line-clamp-1 break-words"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`author-${active.id}`}
                      className="text-neutral-600 dark:text-neutral-400 break-words"
                    >
                      {active.authorName}
                    </motion.p>
                  </div>
                  <Link to={`/post/${active.id}`} className="shrink-0">
                    <motion.span
                      layoutId={`button-${active.id}`}
                      className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white block whitespace-nowrap text-center"
                    >
                      전체 글 확인
                    </motion.span>
                  </Link>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 overflow-auto dark:text-neutral-400 break-words [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(active.content),
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {posts.map((post) => (
          <motion.div
            layoutId={`post-${post.id}`}
            key={`post-${post.id}`}
            onClick={() => setActive(post)}
            className="p-4 flex flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer w-full gap-4"
          >
            <motion.div layoutId={`image-${post.id}`} className="shrink-0">
              <img
                width={56}
                height={56}
                src={post.thumbnail}
                alt={post.title}
                className="h-14 w-14 rounded-lg object-cover object-top"
              />
            </motion.div>
            <div className="flex-1 min-w-0 break-words">
              <motion.h3
                layoutId={`title-${post.id}`}
                className="font-medium text-neutral-800 dark:text-neutral-200 line-clamp-1"
              >
                {post.title}
              </motion.h3>
              <motion.p
                layoutId={`description-${post.id}`}
                className="text-neutral-600 dark:text-neutral-400 line-clamp-2 md:text-base text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.content),
                }}
              />
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
