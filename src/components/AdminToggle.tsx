import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, User } from "lucide-react";

interface AdminToggleProps {
  userRole: 'user' | 'admin';
  onToggleRole: () => void;
}

export const AdminToggle = ({ userRole, onToggleRole }: AdminToggleProps) => {
  return (
    <Card className="marketplace-card mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              userRole === 'admin' ? 'bg-destructive/20' : 'bg-primary/20'
            }`}>
              {userRole === 'admin' ? (
                <Shield className="h-5 w-5 text-destructive" />
              ) : (
                <User className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <p className="font-semibold">Current Role: {userRole === 'admin' ? 'Administrator' : 'Student'}</p>
              <p className="text-sm text-muted-foreground">
                {userRole === 'admin' 
                  ? 'You have admin privileges to manage the marketplace' 
                  : 'You can buy and sell items with other students'
                }
              </p>
            </div>
          </div>
          <Button 
            variant={userRole === 'admin' ? 'destructive' : 'gradient'}
            onClick={onToggleRole}
          >
            Switch to {userRole === 'admin' ? 'Student' : 'Admin'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};