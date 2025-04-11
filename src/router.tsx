import { createBrowserRouter } from "react-router";
import { RootLayout } from "./pages/root.layout";
import { HomePage } from "./pages/home.page";
import { AuthLayout, loader as authLoader } from "./pages/auth.layout";
import {
  loader as protectedLoader,
  ProtectedLayout,
} from "./pages/protected.layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <ProtectedLayout />,
        loader: protectedLoader,
        children: [
          {
            path: "mypage",
            lazy: async () => {
              const { MyPage: Component } = await import("@/pages/mypage.page");
              return { Component };
            },
          },
          {
            path: "post/create",
            lazy: async () => {
              const { PostCreatePage: Component } = await import(
                "@/pages/post-create.page"
              );
              return { Component };
            },
          },
        ],
      },
      {
        path: "post/:postId",
        lazy: async () => {
          const { PostDetailPage: Component } = await import(
            "@/pages/post-detail.page"
          );
          return { Component };
        },
      },
      {
        path: "post",
        lazy: async () => {
          const { PostListPage: Component } = await import(
            "@/pages/post-list.page"
          );
          return { Component };
        },
      },
    ],
  },
  {
    element: <AuthLayout />,
    loader: authLoader,
    children: [
      {
        path: "/sign-in",
        lazy: async () => {
          const { SignInPage: Component } = await import(
            "@/pages/sign-in.page"
          );
          return { Component };
        },
      },
      {
        path: "/callback/google",
        lazy: async () => {
          const { CallbackPage: Component } = await import(
            "@/pages/callback.page"
          );
          return { Component };
        },
      },
    ],
  },
]);
