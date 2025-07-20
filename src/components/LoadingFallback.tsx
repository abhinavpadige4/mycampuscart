import { LoadingSpinner } from "@/components/LoadingSpinner";

export const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <LoadingSpinner />
      <p className="text-muted-foreground">Loading MyCampusCart...</p>
    </div>
  </div>
);