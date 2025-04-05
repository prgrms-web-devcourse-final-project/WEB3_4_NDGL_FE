import { Navbar } from "@/components/layout/navbar";
import { hasLogin } from "@/services/auth.service";
import { Outlet, redirect } from "react-router";

export const AuthLayout = () => {
  return (
    <>
      <Navbar />
      <main className="w-full mt-20 h-[calc(100vh-70px)] flex items-center justify-center">
        <Outlet />
      </main>
    </>
  );
};

export async function loader() {
  try {
    const response = await hasLogin();

    if (response.data?.data?.isLoggedIn) {
      return redirect("/");
    }

    return null;
  } catch (error) {
    console.error("Auth status check failed:", error);
    return null;
  }
}
