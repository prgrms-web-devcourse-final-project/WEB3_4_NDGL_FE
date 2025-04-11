import { RouterProvider } from "react-router";
import { router } from "./router";
import { ThemeProvider } from "./providers/theme.provider";
import { ReactQueryProvider } from "./providers/query.provider";
import { Toaster } from "sonner";
import { ModalProvider } from "./providers/modal.provider";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function App() {
  return (
    <ReactQueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <ModalProvider />
        <Toaster richColors closeButton position="top-right" />
        {/* <ReactQueryDevtools /> */}
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
