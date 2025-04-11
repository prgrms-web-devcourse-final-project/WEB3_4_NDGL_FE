import { Link } from "react-router";
import { Button } from "../ui/button";
import { BannerFeature } from "./banner-feature";

export const Banner = () => {
  return (
    <section className="bg-background flex items-center justify-between px-4 sm:px-12">
      <div className="container mx-auto flex flex-col px-4 py-20">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          이야기가 있는 장소
          <br className="block sm:hidden" /> 공유 플랫폼
        </h1>
        <p className="text-sm text-gray-600 md:text-lg lg:text-xl dark:text-gray-300">
          미디어 속 그곳에서 당신의 경험을 들려주세요.
        </p>
        <div className="mt-8">
          <Link to="/post">
            <Button variant="default" className="cursor-pointer font-semibold">
              전체 포스트 보러가기
            </Button>
          </Link>
        </div>
      </div>
      <BannerFeature />
    </section>
  );
};
