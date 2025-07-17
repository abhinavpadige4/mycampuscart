
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="marketplace-card max-w-md w-full">
        <CardHeader className="text-center">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            Sorry, the page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="gradient" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
