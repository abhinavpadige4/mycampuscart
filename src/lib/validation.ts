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
  // More comprehensive XSS protection
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '');
};

export const validatePhoneNumber = (phone: string): boolean => {
  // More strict phone validation - must start with + and have 7-15 digits
  const phoneRegex = /^\+[1-9]\d{6,14}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 8 && cleanPhone.length <= 16;
};

export const validateImageUrl = (url: string): boolean => {
  try {
    // Allow data URLs for images (base64 encoded images from file uploads)
    if (url.startsWith('data:image/')) {
      return true;
    }
    
    const parsedUrl = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const dangerousPatterns = [
      'javascript:', 'data:text/html', 'data:application', 'vbscript:',
      'file:', 'ftp:', 'about:'
    ];
    
    // Check protocol
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Check for dangerous patterns
    if (dangerousPatterns.some(pattern => url.toLowerCase().includes(pattern))) {
      return false;
    }
    
    // Check file extension for basic image validation
    const pathname = parsedUrl.pathname.toLowerCase();
    const hasImageExtension = allowedImageExtensions.some(ext => pathname.endsWith(ext));
    
    return hasImageExtension || pathname.includes('/image') || pathname.includes('/photo');
  } catch {
    // If URL parsing fails, it might be a data URL that doesn't parse as URL
    return url.startsWith('data:image/');
  }
};