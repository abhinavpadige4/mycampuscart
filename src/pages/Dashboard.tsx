
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Dashboard as DashboardComponent } from "@/components/Dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

export const Dashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSellClick = () => {
    navigate('/sell');
  };

  const handleBuyClick = () => {
    navigate('/marketplace');
  };

  const handleMyListingsClick = () => {
    navigate('/my-listings');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto p-6">
            <DashboardComponent
              userRole={isAdmin ? 'admin' : 'user'}
              onSellClick={handleSellClick}
              onBuyClick={handleBuyClick}
              onMyListingsClick={handleMyListingsClick}
              onAdminClick={handleAdminClick}
            />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};
