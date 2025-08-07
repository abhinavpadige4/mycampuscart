
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import App from "./App.tsx";
import "./index.css";
import { env } from "@/lib/env";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: env.CACHE_DURATION,
      gcTime: env.CACHE_DURATION, // Updated property name for v5
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const PUBLISHABLE_KEY = env.CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
