import { hasLogin } from "@/services/auth.service";
import { AxiosError } from "axios";
import { Outlet, redirect } from "react-router";

export const ProtectedLayout = () => {
  return <Outlet />;
};

export async function loader() {
  try {
    const response = await hasLogin();

    if (!response.data?.data?.isLoggedIn) {
      return redirect("/sign-in");
    }

    return null;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 401 || (error.status && error.status >= 500)) {
        return redirect("/sign-in");
      }
    }
    console.error("Auth status check failed:", error);
    return null;
  }
}
