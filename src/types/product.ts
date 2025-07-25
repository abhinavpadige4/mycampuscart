export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
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
  'North Campus',
  'South Campus',
  'East Campus',
  'West Campus',
  'Central Campus',
  'Off Campus'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
export type ProductCondition = typeof PRODUCT_CONDITIONS[number];