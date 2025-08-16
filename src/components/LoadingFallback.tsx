import { LoadingSpinner } from "@/components/LoadingSpinner";

export const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-green-900/20">
    <div className="text-center space-y-6 p-8">
      <div className="relative">
        <LoadingSpinner size="lg" />
        <div className="absolute inset-0 animate-ping rounded-full bg-green-400/20 opacity-75"></div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          MyCampusCart
        </h2>
        <p className="text-gray-300 animate-pulse">Loading your marketplace...</p>
      </div>
      <div className="flex justify-center space-x-1">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);