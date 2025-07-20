import { Mail, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center mr-3">
                <Mail className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold hero-text">MyCampusCart</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Your trusted student marketplace for buying and selling campus essentials.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <a 
                href="mailto:help.mycampuscart@gmail.com" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                help.mycampuscart@gmail.com
              </a>
              <p className="text-muted-foreground text-sm">
                We're here to help you!
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors block">
                Browse Items
              </a>
              <a href="/sell" className="text-muted-foreground hover:text-primary transition-colors block">
                Sell Items
              </a>
              <a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors block">
                My Account
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for students
          </p>
        </div>
      </div>
    </footer>
  );
};