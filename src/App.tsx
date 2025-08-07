
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingFallback } from "@/components/LoadingFallback";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { UserProfileSync } from "@/components/UserProfileSync";
import { Suspense, lazy } from "react";
// Clerk handles authentication

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard").then(module => ({ default: module.Dashboard })));
const Sell = lazy(() => import("./pages/Sell").then(module => ({ default: module.Sell })));
const Marketplace = lazy(() => import("./pages/Marketplace").then(module => ({ default: module.Marketplace })));
const MyListings = lazy(() => import("./pages/MyListings").then(module => ({ default: module.MyListings })));
const Admin = lazy(() => import("./pages/Admin").then(module => ({ default: module.Admin })));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes (new name for cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
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
        <UserProfileSync />
        <Toaster />
        <Sonner />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* Clerk handles auth, no need for auth route */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
