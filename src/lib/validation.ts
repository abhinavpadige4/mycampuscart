import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  price: z.number().min(0.01, "Price must be greater than 0").max(1000000, "Price must be reasonable"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  location: z.string().min(1, "Location is required"),
  whatsapp_number: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return !url.toLowerCase().includes('javascript:') && !url.toLowerCase().includes('data:text/html');
  } catch {
    return false;
  }
};