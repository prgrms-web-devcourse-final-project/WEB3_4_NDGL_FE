import { PostType } from "@/types/post.type";
import { Heart, User } from "lucide-react";
import { Link } from "react-router";

export const PostCard = ({ post }: { post: PostType }) => {
  return (
    <Link
      to={`/post/${post.id}`}
      className="flex gap-5 overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 dark:bg-black"
    >
      <img
        src={post.thumbnail}
        alt={post.title}
        width={120}
        height={120}
        className="aspect-square rounded-l-xl object-cover"
      />
      <div className="flex flex-col justify-between py-3 pr-4">
        <div>
          <h4 className="mb-2 line-clamp-2 font-semibold text-gray-900 dark:text-gray-100">
            {post.title}
          </h4>
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {post.content}
          </p>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
          <User className="h-4 w-4" />
          <span>{post.authorName}</span>
          <Heart className="ml-2 h-4 w-4" />
          <span>{post.likeCount}</span>
        </div>
      </div>
    </Link>
  );
};
