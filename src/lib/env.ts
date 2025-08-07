// Environment configuration for production readiness

export const env = {
  // Supabase Configuration
  SUPABASE_URL: "https://utqpqrllgnhsvkplohal.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0cXBxcmxsZ25oc3ZrcGxvaGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjAyMzAsImV4cCI6MjA2ODMzNjIzMH0.fjEKGkuiJ0AbhjZ_a5vGAkkp0bc4jGrk0-u3W5k968Y",
  
  // Clerk Configuration - Use production key when deploying
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_Y29tcG9zZWQtZ2liYm9uLTgwLmNsZXJrLmFjY291bnRzLmRldiQ",
  
  // App Configuration
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // App Settings
  APP_NAME: "CampusCart",
  APP_DESCRIPTION: "Buy and sell items on campus",
  
  // Feature Flags
  ENABLE_ANALYTICS: true,
  ENABLE_ERROR_REPORTING: true,
  
  // Performance Settings
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGES_PER_PRODUCT: 5,
  
  // API Rate Limits
  MAX_REQUESTS_PER_MINUTE: 100,
  
  // Cache Settings
  CACHE_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

// Validation
if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
  throw new Error("Missing required Supabase configuration");
}

if (!env.CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing required Clerk configuration");
}

// Log configuration status
if (env.isProduction) {
  console.log('✅ Production configuration loaded');
} else {
  console.log('🔧 Development configuration loaded');
}