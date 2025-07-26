import { ArrowRight, Monitor, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  const features = [
    {
      icon: Monitor,
      title: "Easy to Use",
      description: "List items in minutes with our simple interface"
    },
    {
      icon: Users,
      title: "Campus Community",
      description: "Connect with students in your area for easy meetups"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "University email verification and secure transactions"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left side - Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Campus
              <span className="text-emerald-400 block">Marketplace</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-lg">
              Buy and sell student items with ease. From textbooks to electronics, 
              find everything you need for campus life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={onGetStarted}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg"
              >
                Browse Products
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">1000+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">Safe & Secure</span>
              </div>
            </div>
          </div>

          {/* Right side - Illustration placeholder */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-md bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl p-8 border border-emerald-500/20">
              <div className="text-center space-y-6">
                <div className="text-white text-lg font-semibold">Efter on fre college</div>
                <div className="text-white text-2xl font-bold">student marketplace</div>
                <p className="text-gray-300 text-sm">
                  Use one email or contact us at universitetsoplysninger og listen til en modus track til studies, DiffGrad a and discuss your universitetsoplysninger College.
                </p>
                <div className="flex space-x-4">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    Student Simulator
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-white">
                    Questionnaire
                  </Button>
                </div>
                
                {/* Illustration of students */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose MyCampusCart Section */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose MyCampusCart?
          </h2>
          <p className="text-xl text-gray-400 mb-16">
            We make buying and selling on campus simple, safe, and convenient
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-16 border-t border-gray-800">
            {[
              { number: "1000+", label: "Active Users" },
              { number: "500+", label: "Items Sold" },
              { number: "3", label: "Cities" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};