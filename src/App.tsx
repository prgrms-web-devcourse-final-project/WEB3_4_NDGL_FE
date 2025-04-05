import { RouterProvider } from "react-router";
import { router } from "./router";
import { ThemeProvider } from "./providers/theme.provider";
import { ReactQueryProvider } from "./providers/query.provider";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ReactQueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster richColors closeButton position="top-right" />
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
