import { PostEditor } from "@/components/post/post-editor";
import { LocationSelector } from "@/components/location/location-selector";

export const PostCreatePage = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col-reverse gap-6 md:flex-row">
        <div className="flex-1 rounded-lg bg-white p-4 shadow-md md:p-6 dark:bg-gray-900">
          <PostEditor />
        </div>
        <div className="w-full rounded-lg bg-white p-4 shadow-md md:max-w-sm md:p-6 dark:bg-gray-900">
          <LocationSelector />
        </div>
      </div>
    </section>
  );
};
