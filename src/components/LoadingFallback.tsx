import { LoadingSpinner } from "@/components/LoadingSpinner";

export const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-green-400">Loading MyCampusCart...</p>
    </div>
  </div>
);