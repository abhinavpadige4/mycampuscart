// Production configuration settings

export const config = {
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // API Configuration
  supabase: {
    url: "https://utqpqrllgnhsvkplohal.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0cXBxcmxsZ25oc3ZrcGxvaGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjAyMzAsImV4cCI6MjA2ODMzNjIzMH0.fjEKGkuiJ0AbhjZ_a5vGAkkp0bc4jGrk0-u3W5k968Y"
  },
  
  // Performance settings
  performance: {
    imageMaxSize: 10 * 1024 * 1024, // 10MB
    cacheTime: 15 * 60 * 1000, // 15 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    retryAttempts: 2,
  },
  
  // Security settings
  security: {
    maxRequestsPerMinute: 30,
    maxUploadSize: 10 * 1024 * 1024,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDomains: [
      'utqpqrllgnhsvkplohal.supabase.co',
      'clerk.com',
      'lovableproject.com'
    ]
  },
  
  // Feature flags
  features: {
    enableAnalytics: true,
    enablePerformanceMonitoring: true,
    enableErrorReporting: true,
  }
};

// Validate configuration on startup
if (config.isProduction) {
  console.log('✅ Production configuration loaded');
  
  // Additional production checks
  if (!config.supabase.url || !config.supabase.anonKey) {
    throw new Error('Missing required Supabase configuration');
  }
}