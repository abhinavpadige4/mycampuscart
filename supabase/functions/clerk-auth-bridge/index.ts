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
          // Check if this is the admin email
          const isAdminEmail = data?.email === 'abhinavpadige06@gmail.com';
          
          const { error: createError } = await supabase
            .from('user_profiles')
            .insert({
              clerk_user_id: clerkUserId,
              email: data?.email || `${clerkUserId}@temp.com`,
              first_name: data?.first_name || null,
              last_name: data?.last_name || null,
              role: isAdminEmail ? 'admin' : 'user'
            });

          if (createError) {
            console.error('Error creating profile:', createError);
          }
          
          return new Response(
            JSON.stringify({ role: isAdminEmail ? 'admin' : 'user' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ role: existingProfile?.role || 'user' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'createProduct':
        // Validate input data
        if (!data || typeof data !== 'object') {
          return new Response(
            JSON.stringify({ error: 'Invalid product data' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // First ensure user profile exists
        let userProfileId;
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, role')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (profileError) {
          // Create user profile if it doesn't exist
          const isAdminEmail = data?.email === 'abhinavpadige06@gmail.com';
          
          const { data: newProfile, error: createProfileError } = await supabase
            .from('user_profiles')
            .insert({
              clerk_user_id: clerkUserId,
              email: data?.email || `${clerkUserId}@temp.com`,
              first_name: data?.first_name || null,
              last_name: data?.last_name || null,
              role: isAdminEmail ? 'admin' : 'user'
            })
            .select('id')
            .single();

          if (createProfileError) {
            console.error('Failed to create user profile:', createProfileError);
            return new Response(
              JSON.stringify({ error: 'Failed to create user profile' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          userProfileId = newProfile.id;
        } else {
          // Check if user is blocked
          if (userProfile.role === 'blocked') {
            return new Response(
              JSON.stringify({ error: 'Account is blocked' }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          userProfileId = userProfile.id;
        }

        // Validate and sanitize product data
        const sanitizedData = {
          title: data.title?.trim(),
          description: data.description?.trim(),
          price: parseFloat(data.price) || 0,
          category: data.category?.trim(),
          location: data.location?.trim(),
          images: Array.isArray(data.images) ? data.images.slice(0, 5) : [], // Limit to 5 images
          whatsapp_number: data.whatsapp_number?.trim() || null
        };

        // Validate required fields
        if (!sanitizedData.title || !sanitizedData.description || !sanitizedData.category || !sanitizedData.location) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (sanitizedData.price < 0) {
          return new Response(
            JSON.stringify({ error: 'Price cannot be negative' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: product, error: productError } = await supabase
          .from('products')
          .insert({
            ...sanitizedData,
            user_id: userProfileId
          })
          .select()
          .single();

        if (productError) {
          console.error('Error creating product:', productError);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to create product',
              details: productError.message,
              code: productError.code 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Log the action for security audit
        console.log(`Product created by user ${clerkUserId}: ${product.id}`);

        return new Response(
          JSON.stringify(product),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getUserProducts':
        // First ensure user profile exists
        let userProfile = await supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .maybeSingle();

        if (!userProfile.data) {
          // Create profile if it doesn't exist
          const isAdminEmail = data?.email === 'abhinavpadige06@gmail.com';
          
          const { data: newProfile } = await supabase
            .from('user_profiles')
            .insert({
              clerk_user_id: clerkUserId,
              email: data?.email || `${clerkUserId}@temp.com`,
              first_name: data?.first_name || null,
              last_name: data?.last_name || null,
              role: isAdminEmail ? 'admin' : 'user'
            })
            .select('id')
            .single();

          userProfile.data = newProfile;
        }

        if (!userProfile.data) {
          return new Response(
            JSON.stringify({ products: [] }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Fetch user's products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', userProfile.data.id)
          .order('created_at', { ascending: false });

        if (productsError) {
          console.error('Error fetching products:', productsError);
          throw productsError;
        }

        return new Response(
          JSON.stringify({ products: products || [] }),
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