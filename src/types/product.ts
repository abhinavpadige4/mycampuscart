
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
  status: 'active' | 'sold';
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
  "Block A",
  "Block B", 
  "Block C",
  "North Campus",
  "South Campus",
  "East Campus",
  "West Campus",
  "Library Area",
  "Sports Complex",
  "Cafeteria"
] as const;
