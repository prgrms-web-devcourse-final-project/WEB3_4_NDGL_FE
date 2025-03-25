import { PostType } from '@/types/post.type';
import { Card, CardContent, CardHeader } from '../ui/card';
import Image from 'next/image';
import { Calendar, Heart, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { LINKS } from '@/constants/links';

interface PostCardProps {
  post: PostType;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-md transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="p-0">
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={960}
          height={600}
          className="aspect-video object-cover"
        />
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 p-4">
        <Link href={LINKS.POST(post.id)} className="">
          <h2 className="line-clamp-2 text-xl font-semibold">{post.title}</h2>
          <p className="line-clamp-3 text-sm text-gray-600">{post.content}</p>
        </Link>
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {post.authorName}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {post.likeCount}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post.commentCount}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
