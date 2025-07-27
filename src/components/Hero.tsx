import SparklesPreview from "@/components/ui/sparkles-demo";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      <SparklesPreview />
    </div>
  );
};