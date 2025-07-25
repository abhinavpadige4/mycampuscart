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
        // First ensure user profile exists
        const { data: existingProfile, error: profileFetchError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (profileFetchError && profileFetchError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileFetchError);
        }

        // If profile doesn't exist, create it
        if (!existingProfile) {
          const { error: createError } = await supabase
            .from('user_profiles')
            .insert({
              clerk_user_id: clerkUserId,
              email: data?.email || `${clerkUserId}@temp.com`,
              first_name: data?.first_name || null,
              last_name: data?.last_name || null,
              role: 'user'
            });

          if (createError) {
            console.error('Error creating profile:', createError);
          }
        }

        return new Response(
          JSON.stringify({ role: existingProfile?.role || 'user' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'createProduct':
        // First ensure user profile exists
        let userProfileId;
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (profileError) {
          // Create user profile if it doesn't exist
          const { data: newProfile, error: createProfileError } = await supabase
            .from('user_profiles')
            .insert({
              clerk_user_id: clerkUserId,
              email: data?.email || `${clerkUserId}@temp.com`,
              first_name: data?.first_name || null,
              last_name: data?.last_name || null,
              role: 'user'
            })
            .select('id')
            .single();

          if (createProfileError) {
            return new Response(
              JSON.stringify({ error: 'Failed to create user profile' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          userProfileId = newProfile.id;
        } else {
          userProfileId = userProfile.id;
        }

        const { data: product, error: productError } = await supabase
          .from('products')
          .insert({
            ...data,
            user_id: userProfileId
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