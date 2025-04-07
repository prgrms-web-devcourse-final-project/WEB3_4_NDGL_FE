import { MessageCircle, ThumbsUp } from "lucide-react";
import { PostType } from "@/types/post.type";
import DOMPurify from "dompurify";
import { Link } from "react-router";

interface AllPostsProps {
  posts: PostType[];
}

export const AllPosts = ({ posts }: AllPostsProps) => {
  return (
    <section className="bg-background py-12">
      <h2 className="relative mb-8 inline-block text-3xl font-extrabold after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-2/3 after:rounded after:bg-gradient-to-r after:from-blue-400 after:to-indigo-600 dark:after:from-blue-500 dark:after:to-indigo-400">
        전체 글
      </h2>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link key={post.id} to={`/post/${post.id}`}>
            <article className="border-border flex flex-col gap-4 border-b pb-6 md:flex-row">
              <img
                src={post.thumbnail}
                alt={post.title}
                width={400}
                height={250}
                className="h-[160px] w-full rounded-xl object-cover md:min-w-[240px] md:max-w-[240px]"
              />
              <div className="flex flex-grow flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <h3 className="text-card-foreground line-clamp-2 text-xl font-semibold">
                    {post.title}
                  </h3>
                  <div
                    className="text-muted-foreground text-sm line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.content),
                    }}
                  />
                </div>
                <div className="text-muted-foreground mt-3 text-xs">
                  {new Date(post.createdAt).toLocaleDateString()} ·{" "}
                  {post.authorName}
                </div>
                <div className="text-muted-foreground mt-2 flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={16} /> {post.likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} /> {post.commentCount}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};
