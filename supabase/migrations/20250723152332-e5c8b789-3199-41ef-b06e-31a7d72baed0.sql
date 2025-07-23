-- Fix remaining anonymous access policies
-- Remove all policies that allow anonymous access

-- Fix products table policies to require proper authentication
DROP POLICY IF EXISTS "Users can delete own products" ON public.products;
DROP POLICY IF EXISTS "Users can update own products" ON public.products;

CREATE POLICY "Authenticated users can update own products"
ON public.products
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authenticated users can delete own products"
ON public.products
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Create function to generate Supabase JWT for Clerk users
CREATE OR REPLACE FUNCTION public.generate_supabase_jwt(clerk_user_id text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Convert clerk_user_id to a deterministic UUID
    user_uuid := encode(digest(clerk_user_id, 'sha256'), 'hex')::uuid;
    
    -- Return the UUID as text for use in RLS policies
    RETURN user_uuid::text;
END;
$$;