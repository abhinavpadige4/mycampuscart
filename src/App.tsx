
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingFallback } from "@/components/LoadingFallback";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { Suspense, lazy } from "react";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard").then(module => ({ default: module.Dashboard })));
const Sell = lazy(() => import("./pages/Sell").then(module => ({ default: module.Sell })));
const Marketplace = lazy(() => import("./pages/Marketplace").then(module => ({ default: module.Marketplace })));
const MyListings = lazy(() => import("./pages/MyListings").then(module => ({ default: module.MyListings })));
const Admin = lazy(() => import("./pages/Admin").then(module => ({ default: module.Admin })));
const SignInPage = lazy(() => import("./pages/SignIn"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PerformanceMonitor />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
