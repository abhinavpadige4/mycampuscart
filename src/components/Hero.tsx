import { ArrowRight, ShoppingBag, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  const features = [
    {
      icon: ShoppingBag,
      title: "Buy & Sell",
      description: "Find great deals on textbooks, electronics, and more"
    },
    {
      icon: DollarSign,
      title: "Save Money",
      description: "Get items at student-friendly prices"
    },
    {
      icon: Users,
      title: "Student Community",
      description: "Connect with your campus community"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Your Campus
            <span className="hero-text block mt-2">Marketplace</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Buy and sell used items with fellow students. From textbooks to furniture, 
            find everything you need at unbeatable prices.
          </p>
          <Button 
            variant="gradient" 
            size="xl" 
            onClick={onGetStarted}
            className="group"
          >
            Start Shopping
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <Card key={index} className="marketplace-card group hover:scale-105 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {[
            { number: "500+", label: "Active Students" },
            { number: "1,200+", label: "Items Listed" },
            { number: "850+", label: "Successful Sales" },
            { number: "4.8★", label: "User Rating" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};