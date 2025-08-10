export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  status: string;
  views_count: number;
  whatsapp_number?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  // For joins with profiles
  seller_name?: string;
  name?: string;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images?: string[];
  whatsapp_number?: string;
}

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Books',
  'Clothing',
  'Sports',
  'Furniture',
  'Other'
] as const;

export const PRODUCT_CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor'
] as const;

// Legacy exports for backward compatibility
export const CATEGORIES = PRODUCT_CATEGORIES;
export const LOCATIONS = [
  // Uttar Pradesh
  'Varanasi', 'Kanpur', 'Lucknow', 'Allahabad (Prayagraj)', 'Greater Noida', 'Agra', 
  'Bareilly', 'Meerut', 'Ghaziabad', 'Aligarh',
  
  // Maharashtra  
  'Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik', 'Kolhapur', 'Ahmednagar', 
  'Thane', 'Jalgaon', 'Solapur',
  
  // Tamil Nadu
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli (Trichy)', 'Salem', 'Vellore', 
  'Erode', 'Thanjavur', 'Tirunelveli', 'Kancheepuram',
  
  // Madhya Pradesh
  'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 
  'Dewas', 'Ratlam',
  
  // West Bengal
  'Kolkata', 'Rajarhat / Newtown', 'Durgapur', 'Kharagpur', 'Siliguri', 'Bardhaman', 
  'Hooghly', 'Haldia', 'Midnapore', 'Kalyani',
  
  // Rajasthan
  'Jaipur', 'Kota', 'Jodhpur', 'Udaipur', 'Ajmer', 'Bikaner', 'Bharatpur', 'Alwar', 
  'Sikar', 'Pali',
  
  // Bihar
  'Patna', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Muzaffarpur', 'Hajipur', 'Chapra', 
  'Arrah', 'Purnea', 'Saharsa',
  
  // Karnataka
  'Bengaluru (Bangalore)', 'Mysore', 'Mangaluru (Mangalore)', 'Hubballi-Dharwad', 
  'Belagavi', 'Davangere', 'Kalaburagi (Gulbarga)', 'Shivamogga (Shimoga)', 
  'Tumakuru (Tumkur)', 'Manipal',
  
  // Andhra Pradesh
  'Visakhapatnam (Vizag)', 'Tirupati', 'Vijayawada', 'Guntur', 'Kakinada', 'Nellore', 
  'Anantapur', 'Kurnool', 'Rajahmundry', 'Ongole',
  
  // Gujarat
  'Ahmedabad', 'Gandhinagar', 'Vadodara (Baroda)', 'Surat', 'Rajkot', 'Anand', 
  'Bhavnagar', 'Jamnagar', 'Bhuj', 'Mehsana',
  
  // Delhi (Union Territory)
  'GTB Nagar', 'Mukherjee Nagar', 'Kamla Nagar', 'Laxmi Nagar', 'Malviya Nagar', 
  'South Extension & Amar Colony', 'Karol Bagh & Rajendra Place', 'Saket', 
  'Noida Sector 15, 25 & 62', 'Gurgaon Sector 44 & 45'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
export type ProductCondition = typeof PRODUCT_CONDITIONS[number];