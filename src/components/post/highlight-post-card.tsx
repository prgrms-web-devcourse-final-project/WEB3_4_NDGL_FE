import { PostType } from '@/types/post.type';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, User } from 'lucide-react';
import { LINKS } from '@/constants/links';

interface HighlightPostCardProps {
  post: PostType;
}

export const HighlightPostCard = ({ post }: HighlightPostCardProps) => {
  return (
    <Link
      href={LINKS.POST(post.id)}
      className="group relative block overflow-hidden rounded-xl shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <Image
        src={post.thumbnail}
        alt={post.title}
        width={960}
        height={540}
        className="aspect-video rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
      <div className="absolute bottom-0 p-5 text-white">
        <h3 className="line-clamp-2 text-xl font-bold">{post.title}</h3>
        <div className="mt-2 flex items-center gap-3 text-sm opacity-90">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {post.authorName}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {post.likeCount}
          </div>
        </div>
      </div>
    </Link>
  );
};
