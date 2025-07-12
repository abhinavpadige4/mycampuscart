import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ClerkAuth } from "@/components/ClerkAuth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [clerkKey, setClerkKey] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!clerkKey) {
      setShowAuth(true);
      toast({
        title: "Authentication Setup Required",
        description: "Please configure Clerk authentication to continue.",
      });
    } else {
      // Navigate to dashboard or show login
      toast({
        title: "Welcome to CampusCart!",
        description: "Redirecting to authentication...",
      });
    }
  };

  const handleSetupClick = () => {
    toast({
      title: "Clerk Setup",
      description: "Please provide your Clerk publishable key to continue.",
    });
  };

  const handleLogin = () => {
    // For demo purposes, navigate directly to dashboard
    // In production, this would show Clerk auth modal
    navigate('/dashboard');
  };

  if (showAuth) {
    return <ClerkAuth publishableKey={clerkKey} onSetupClick={handleSetupClick} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={handleLogin} />
      <Hero onGetStarted={handleGetStarted} />
    </div>
  );
};

export default Index;
