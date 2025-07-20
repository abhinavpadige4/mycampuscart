import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/useAuth";

const SignInPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      navigate('/marketplace');
    }
  }, [isLoaded, isAuthenticated, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to <span className="hero-text">MyCampusCart</span>
          </h1>
          <p className="text-muted-foreground">
            Sign in to start buying and selling with your campus community
          </p>
        </div>
        
        <SignIn 
          afterSignInUrl="/marketplace"
          redirectUrl="/marketplace"
        />
      </div>
    </div>
  );
};

export default SignInPage;