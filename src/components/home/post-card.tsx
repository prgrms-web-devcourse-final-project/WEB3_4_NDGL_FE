import { PostType } from '@/types/post.type';
import { Card, CardContent, CardHeader } from '../ui/card';
import Image from 'next/image';
import { Calendar, Heart, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { LINKS } from '@/constants/links';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: PostType;
  dir: 'row' | 'col';
}

export const PostCard = ({ post, dir }: PostCardProps) => {
  const isRow = dir === 'row';

  return (
    <Card
      className={cn(
        'flex gap-0 overflow-hidden py-0',
        isRow ? 'flex-row' : 'flex-col justify-between',
      )}
    >
      <CardHeader className={cn('p-0', isRow ? 'w-1/6' : 'w-full')}>
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={960}
          height={600}
          className={cn(
            'object-cover',
            isRow ? 'aspect-square' : 'aspect-video',
          )}
        />
        {!isRow && (
          <Link
            href={LINKS.POST(post.id)}
            className="flex flex-col gap-2 px-4 pt-2"
          >
            <h2 className="line-clamp-1 text-xl font-semibold">{post.title}</h2>
            <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
              {post.content}
            </p>
          </Link>
        )}
      </CardHeader>
      <CardContent
        className={cn(
          'flex flex-col justify-between gap-2 p-4',
          isRow ? 'w-5/6' : 'w-full',
        )}
      >
        <Link
          href={LINKS.POST(post.id)}
          className="flex h-full flex-col justify-between"
        >
          {isRow && (
            <div className="flex flex-col gap-2">
              <h2 className="line-clamp-1 text-xl font-semibold">
                {post.title}
              </h2>
              <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                {post.content}
              </p>
            </div>
          )}
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
        </Link>
      </CardContent>
    </Card>
  );
};
