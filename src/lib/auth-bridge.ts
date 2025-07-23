// Authentication bridge for Clerk + Supabase integration

const SUPABASE_URL = "https://utqpqrllgnhsvkplohal.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0cXBxcmxsZ25oc3ZrcGxvaGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjAyMzAsImV4cCI6MjA2ODMzNjIzMH0.fjEKGkuiJ0AbhjZ_a5vGAkkp0bc4jGrk0-u3W5k968Y";

export const createProductSecurely = async (clerkUserId: string, productData: any, userInfo?: any) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/clerk-auth-bridge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'clerk-user-id': clerkUserId
      },
      body: JSON.stringify({
        clerkUserId,
        action: 'createProduct',
        data: {
          ...productData,
          ...userInfo
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createProductSecurely:', error);
    throw error;
  }
};

export const getUserRoleSecurely = async (clerkUserId: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/clerk-auth-bridge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'clerk-user-id': clerkUserId
      },
      body: JSON.stringify({
        clerkUserId,
        action: 'getUserRole'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getUserRoleSecurely:', error);
    return { role: 'user' }; // Default fallback
  }
};