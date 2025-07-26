import { Mail, Heart, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400">MyCampusCart</h3>
            <p className="text-sm text-gray-400 max-w-xs">
              Your trusted marketplace for buying and selling used items within the campus community.
            </p>
            <p className="text-sm text-gray-400">
              Made with <Heart className="inline h-4 w-4 text-red-500" /> for students
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-3">
              <a href="/marketplace" className="block text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                Browse Products
              </a>
              <a href="/sell" className="block text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                Sell Your Item
              </a>
              <a href="/my-listings" className="block text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                My Listings
              </a>
              <a href="#" className="block text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                Safety Tips
              </a>
            </div>
          </div>

          {/* Get Help */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Get Help</h3>
            <div className="space-y-3">
              <a 
                href="mailto:help.mycampuscart@gmail.com" 
                className="flex items-center space-x-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>help.mycampuscart@gmail.com</span>
              </a>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Hyderabad, Pune, Bangalore</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Our Impact</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="text-emerald-400 font-semibold">1000+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-sm">
                <div className="text-emerald-400 font-semibold">500+</div>
                <div className="text-gray-400">Items Sold</div>
              </div>
              <div className="text-sm">
                <div className="text-emerald-400 font-semibold">3</div>
                <div className="text-gray-400">Cities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2024 MyCampusCart. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};