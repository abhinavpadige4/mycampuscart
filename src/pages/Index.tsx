
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { isLoaded, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isLoaded, isAuthenticated, navigate]);

  const handleGetStarted = () => {
    // Navigate to dashboard since Clerk handles auth automatically
    navigate('/dashboard');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero onGetStarted={handleGetStarted} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
