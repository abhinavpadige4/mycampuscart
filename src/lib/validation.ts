import { z } from "zod";

// Enhanced input validation schemas
export const productSchema = z.object({
  name: z.string()
    .min(1, "Product name is required")
    .max(100, "Product name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_.,()&]+$/, "Product name contains invalid characters"),
  
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  
  price: z.number()
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price is too high")
    .refine((val) => Number.isFinite(val), "Price must be a valid number"),
  
  category: z.string()
    .min(1, "Category is required"),
  
  location: z.string()
    .min(1, "Location is required"),
  
  whatsapp_number: z.string()
    .min(10, "WhatsApp number must be at least 10 digits")
    .max(15, "WhatsApp number must be less than 15 digits")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid WhatsApp number format"),
  
  image: z.string()
    .url("Invalid image URL")
    .optional()
    .or(z.literal(""))
});

export const userProfileSchema = z.object({
  first_name: z.string()
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
    .optional(),
  
  last_name: z.string()
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
    .optional(),
  
  email: z.string()
    .email("Invalid email address")
    .max(100, "Email must be less than 100 characters")
});

// XSS prevention utility
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .trim()
    .slice(0, 1000); // Limit length
};

// Phone number validation utility
export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

// Image URL validation utility
export const validateImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const allowedDomains = [
      'images.unsplash.com',
      'unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'res.cloudinary.com'
    ];
    
    return allowedDomains.some(domain => parsedUrl.hostname.includes(domain));
  } catch {
    return false;
  }
};

export type ProductFormData = z.infer<typeof productSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;