import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider } from "@heroui/system";
import { Toaster } from "sonner";
import { ThemeProvider } from "./hooks/useTheme";
import { I18nProvider } from "./i18n/I18nContext";
import App from "./App";
import "@/styles/globals.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <HeroUIProvider>
          <I18nProvider>
            <App />
            <Toaster richColors position="top-right" />
          </I18nProvider>
        </HeroUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
