import { Banner } from "@/components/home/banner";
import { Posts } from "@/components/home/posts";
import { FloatingButton } from "@/components/layout/floating-button";
import { QUERY_KEY } from "@/lib/query-key";
import { hasLogin } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export const HomePage = () => {
  const { data } = useQuery({
    queryKey: QUERY_KEY.AUTH.LOGIN,
    queryFn: hasLogin,
    select: (res) => res.data.data,
  });

  return (
    <>
      <Banner />
      <Posts />
      {data?.isLoggedIn && <FloatingButton />}
    </>
  );
};
