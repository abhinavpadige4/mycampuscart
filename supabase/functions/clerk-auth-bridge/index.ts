import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, clerk-user-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clerkUserId, action, data } = await req.json();
    
    if (!clerkUserId) {
      return new Response(
        JSON.stringify({ error: 'Clerk user ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    switch (action) {
      case 'getUserRole':
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (profileError) {
          return new Response(
            JSON.stringify({ role: 'user' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ role: profile.role }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'createProduct':
        // Generate a UUID for the user based on Clerk ID
        const userUuid = await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(clerkUserId)
        );
        const userUuidHex = Array.from(new Uint8Array(userUuid))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
          .slice(0, 32);
        
        const formattedUuid = [
          userUuidHex.slice(0, 8),
          userUuidHex.slice(8, 12),
          userUuidHex.slice(12, 16),
          userUuidHex.slice(16, 20),
          userUuidHex.slice(20, 32)
        ].join('-');

        const { data: product, error: productError } = await supabase
          .from('products')
          .insert({
            ...data,
            user_id: formattedUuid,
            seller_id: clerkUserId
          })
          .select()
          .single();

        if (productError) {
          return new Response(
            JSON.stringify({ error: productError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify(product),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in clerk-auth-bridge:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});