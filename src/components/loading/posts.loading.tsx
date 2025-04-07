import { Skeleton } from "../ui/skeleton";

export const PostsLoading = () => {
  return (
    <div className="container py-8 px-4 mx-auto space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 mb-4 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl border overflow-hidden shadow-sm"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 mb-4 rounded-lg" />
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row gap-4 border-b pb-6"
          >
            <Skeleton className="h-[160px] w-full md:w-[240px] rounded-xl" />
            <div className="flex flex-1 flex-col justify-between space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-5 w-5/6" />
              </div>
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
