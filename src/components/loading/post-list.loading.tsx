import { Skeleton } from "../ui/skeleton";

export const PostListLoading = () => {
  return (
    <div className="px-4 py-10 w-full flex flex-col items-center gap-4">
      {Array.from({ length: 10 }).map((_, idx) => (
        <Skeleton key={idx} className="max-w-2xl w-full h-20" />
      ))}
    </div>
  );
};
