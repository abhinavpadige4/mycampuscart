// Security utilities for production

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>'"&]/g, (match) => {
      const escapeMap: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[match];
    })
    .trim()
    .slice(0, 1000); // Limit length
};

// Validate image URLs
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    // Only allow https and lovable uploads
    return urlObj.protocol === 'https:' || url.startsWith('/') || url.includes('lovable-uploads');
  } catch {
    return false;
  }
};

// Validate phone number format (basic)
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Basic phone validation - digits, spaces, +, -, ()
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Rate limiting check (client-side basic check)
export const checkRateLimit = (key: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const windowKey = `rate_limit_${key}_${Math.floor(now / windowMs)}`;
  
  try {
    const stored = localStorage.getItem(windowKey);
    const count = stored ? parseInt(stored) : 0;
    
    if (count >= maxRequests) {
      return false;
    }
    
    localStorage.setItem(windowKey, (count + 1).toString());
    
    // Clean up old entries
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith('rate_limit_') && k !== windowKey) {
        localStorage.removeItem(k);
      }
    });
    
    return true;
  } catch {
    return true; // Allow if localStorage fails
  }
};

// Content Security Policy headers helper
export const getCSPHeader = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://clerk.com https://*.clerk.accounts.dev",
    "frame-src 'self' https://clerk.com https://*.clerk.accounts.dev"
  ].join('; ');
};