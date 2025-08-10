import { Mail, Heart, MapPin, Plus, Users, DollarSign } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Choose Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Why Choose MyCampusCart?</h2>
          <p className="text-gray-400 text-center mb-12">Simple, secure, and designed for students</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy Selling</h3>
              <p className="text-gray-400 text-sm">List your items in seconds with our simple form</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Campus Community</h3>
              <p className="text-gray-400 text-sm">Connect with students from your city</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Great Deals</h3>
              <p className="text-gray-400 text-sm">Find quality items at student-friendly prices</p>
            </div>
          </div>
        </div>

        {/* Available Across India Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Available Across India</h3>
          <p className="text-gray-400 text-center mb-8">Serving students in 100+ cities across major states</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            {[
              'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune',
              'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
              'Indore', 'Bhopal', 'Visakhapatnam', 'Vadodara', 'Coimbatore', 'Agra',
              'Varanasi', 'Madurai', 'Meerut', 'Rajkot', 'Kota', 'Gwalior'
            ].map((city) => (
              <div key={city} className="text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">
                {city}
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-center mt-6 text-sm">...and many more cities across India</p>
        </div>

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
                <span>Serving 100+ cities across India</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Our Impact</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="text-emerald-400 font-semibold">50,000+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-sm">
                <div className="text-emerald-400 font-semibold">200,000+</div>
                <div className="text-gray-400">Items Sold</div>
              </div>
              <div className="text-sm">
                <div className="text-emerald-400 font-semibold">100+</div>
                <div className="text-gray-400">Cities Served</div>
              </div>
              <div className="text-sm">
                <div className="text-emerald-400 font-semibold">₹50Cr+</div>
                <div className="text-gray-400">Transactions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2025 MyCampusCart. All rights reserved.
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