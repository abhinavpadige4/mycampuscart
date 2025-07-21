
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  whatsapp_number: string;
  location: string;
  seller_id: string;
  seller_name: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
  product_number?: string;
  status: 'active' | 'sold' | 'inactive';
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  whatsapp_number: string;
  location: string;
}

export const CATEGORIES = [
  "Books",
  "Electronics", 
  "Furniture",
  "Accessories",
  "Clothing",
  "Sports & Recreation",
  "Miscellaneous"
] as const;

export const LOCATIONS = [
  // Hyderabad
  "Alwal", "Amberpet", "Ameerpet", "Attapur", "Bacharam", "Bachupally", "Barkatpura", "Boduppal", "Chanda Nagar", "Chikkadpally", "Dilsukhnagar", "ECIL", "Gachibowli", "Ghatkesar", "Habsiguda", "Hasthinapuram", "Hayath Nagar", "Himayathnagar", "Ibrahimpatnam", "Jeedimetla", "Kompally", "Kondapur", "Koti", "Kukatpally", "Lingampally", "Madhapur", "Malakpet", "Manikonda", "Maradpally", "Medchal", "Mehdipatnam", "Miyapur", "Musheerabad", "Nallakunta", "Nampally", "Narayanguda", "Narsingi", "Nizampet", "Padmarao Nagar", "Pochampally", "Rajendra Nagar", "Ramachandra Puram", "SR Nagar", "Saroornagar", "Secunderabad", "Shankarpally", "Tarnaka", "Turkayamzal", "Uppal", "Vidya Nagar",
  // Pune  
  "Aundh", "Balewadi", "Baner", "Bund Garden", "Dhankawadi", "Dhankawadi-Bibewadi", "Hadapsar", "Hinjewadi", "Karve Nagar", "Koregaon Park", "Kothrud", "Magarpatta City", "Pimple Saudagar", "Pune", "Shivajinagar", "Viman Nagar", "Wakad",
  // Bangalore
  "BTM Layout", "Banashankari", "Bannerghatta Road", "Basavanagudi", "Bellandur", "Electronic City", "HSR Layout", "Hebbal", "Indiranagar", "J P Nagar", "Jayanagar", "K R Puram", "Koramangala", "Mahalakshmi Layout", "Malleshwaram", "Marathahalli", "Nagarbhavi", "Rajaji Nagar", "Sadashivanagar", "Sarjapur Road", "Ulsoor", "Vijayanagar", "Whitefield", "Yelahanka"
] as const;
