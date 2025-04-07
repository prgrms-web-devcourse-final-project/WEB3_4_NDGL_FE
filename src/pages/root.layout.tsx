import { Navbar } from "@/components/layout/navbar";
import { Outlet } from "react-router";

export const RootLayout = () => {
  return (
    <>
      <Navbar />
      <main className="mt-10 sm:mt-20">
        <Outlet />
      </main>
    </>
  );
};
