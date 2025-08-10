import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Create Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log(`Processing action: ${action} for user: ${clerkUserId}`);

    switch (action) {
      case 'createProfile':
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (existingProfile) {
          return new Response(
            JSON.stringify({ success: true, profile: existingProfile }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create new profile
        const isAdmin = data?.email === 'help.mycampuscart@gmail.com' || data?.email === 'abhinavpadige06@gmail.com';
        
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            clerk_user_id: clerkUserId,
            email: data?.email || `user_${clerkUserId}@temp.com`,
            first_name: data?.firstName || null,
            last_name: data?.lastName || null,
            role: isAdmin ? 'admin' : 'user'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return new Response(
            JSON.stringify({ error: 'Failed to create profile', details: createError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Profile created for user: ${clerkUserId}`);
        return new Response(
          JSON.stringify({ success: true, profile: newProfile }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getUserRole':
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('clerk_user_id', clerkUserId)
          .single();

        return new Response(
          JSON.stringify({ role: userProfile?.role || 'user' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'createProduct':
        // Get user profile ID
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id, role')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (!profile) {
          return new Response(
            JSON.stringify({ error: 'User profile not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (profile.role === 'blocked') {
          return new Response(
            JSON.stringify({ error: 'Account is blocked' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate product data
        if (!data?.title || !data?.description || !data?.category || !data?.location) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: product, error: productError } = await supabase
          .from('products')
          .insert({
            title: data.title.trim(),
            description: data.description.trim(),
            price: parseFloat(data.price) || 0,
            category: data.category.trim(),
            location: data.location.trim(),
            images: Array.isArray(data.images) ? data.images.slice(0, 5) : [],
            whatsapp_number: data.whatsapp_number?.trim() || null,
            user_id: profile.id
          })
          .select()
          .single();

        if (productError) {
          console.error('Error creating product:', productError);
          return new Response(
            JSON.stringify({ error: 'Failed to create product', details: productError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Product created: ${product.id} by user: ${clerkUserId}`);
        return new Response(
          JSON.stringify({ success: true, product }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getUserProducts':
        const { data: userProfileData } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (!userProfileData) {
          return new Response(
            JSON.stringify({ products: [] }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', userProfileData.id)
          .order('created_at', { ascending: false });

        if (productsError) {
          console.error('Error fetching products:', productsError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch products' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ products: products || [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getAllProducts':
        const { data: allProducts, error: allProductsError } = await supabase
          .from('products')
          .select(`
            *,
            user_profiles!inner(first_name, last_name, email)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (allProductsError) {
          console.error('Error fetching all products:', allProductsError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch products' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Format products with seller info
        const formattedProducts = allProducts.map(product => ({
          ...product,
          seller_name: `${product.user_profiles.first_name || ''} ${product.user_profiles.last_name || ''}`.trim() || product.user_profiles.email
        }));

        return new Response(
          JSON.stringify({ products: formattedProducts }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'updateProduct':
        // Get user profile ID for permission check
        const { data: updateProfile } = await supabase
          .from('user_profiles')
          .select('id, role')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (!updateProfile) {
          return new Response(
            JSON.stringify({ error: 'User profile not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update(data.updates)
          .eq('id', data.productId)
          .eq('user_id', updateProfile.id) // Ensure user owns the product
          .select()
          .single();

        if (updateError) {
          console.error('Error updating product:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update product', details: updateError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, product: updatedProduct }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'deleteProduct':
        // Get user profile ID for permission check
        const { data: deleteProfile } = await supabase
          .from('user_profiles')
          .select('id, role')
          .eq('clerk_user_id', clerkUserId)
          .single();

        if (!deleteProfile) {
          return new Response(
            JSON.stringify({ error: 'User profile not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', data.productId)
          .eq('user_id', deleteProfile.id); // Ensure user owns the product

        if (deleteError) {
          console.error('Error deleting product:', deleteError);
          return new Response(
            JSON.stringify({ error: 'Failed to delete product', details: deleteError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
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
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});