import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { PostType } from "@/types/post.type";

interface PopularPostsCarouselProps {
  posts: PostType[];
}

export const PopularPosts = ({ posts }: PopularPostsCarouselProps) => {
  return (
    <Carousel opts={{ align: "start", loop: true }}>
      <CarouselContent>
        {posts.map((post, index) => (
          <CarouselItem
            key={post.id}
            className="basis-full md:basis-1/2 lg:basis-1/3"
          >
            <div className="border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border shadow-md transition-shadow hover:shadow-lg">
              <img
                src={post.thumbnail}
                alt={post.title}
                width={600}
                height={400}
                className="h-48 w-full object-cover"
              />
              <div className="flex flex-grow flex-col justify-between p-4">
                <div>
                  <h3 className="text-card-foreground line-clamp-2 text-lg font-semibold">
                    {index + 1}. {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {new Date(post.createdAt).toLocaleDateString()} ·{" "}
                    {post.authorName}
                  </p>
                </div>
                <div className="text-muted-foreground mt-4 flex gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={14} /> {post.likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} /> 0
                  </span>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-8 flex items-center gap-4">
        <CarouselPrevious className="cursor-pointer" />
        <CarouselNext className="cursor-pointer" />
      </div>
    </Carousel>
  );
};
