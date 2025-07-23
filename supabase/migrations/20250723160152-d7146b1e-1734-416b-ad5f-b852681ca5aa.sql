-- PRODUCTION-READY SECURITY MIGRATION
-- Complete table recreation with proper Clerk + Supabase integration

-- 1. Drop and recreate user_profiles table with proper constraints
DROP TABLE IF EXISTS public.user_profiles CASCADE;
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Drop and recreate products table with proper user mapping
DROP TABLE IF EXISTS public.products CASCADE;
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  image TEXT,
  category TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  location TEXT NOT NULL,
  seller_id TEXT NOT NULL, -- Clerk user ID
  seller_name TEXT NOT NULL,
  product_number TEXT UNIQUE,
  user_id UUID NOT NULL, -- Maps to user_profiles.id
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE
);

-- 3. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Create authentication context function
CREATE OR REPLACE FUNCTION public.get_clerk_user_id()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT current_setting('request.jwt.claims', true)::json->>'clerk_user_id';
$$;

-- 5. Create secure user profile policies (NO anonymous access)
CREATE POLICY "Users can view own profile only"
ON public.user_profiles FOR SELECT
TO authenticated
USING (clerk_user_id = public.get_clerk_user_id());

CREATE POLICY "Users can insert own profile only"
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK (clerk_user_id = public.get_clerk_user_id() AND role = 'user');

CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (clerk_user_id = public.get_clerk_user_id())
WITH CHECK (clerk_user_id = public.get_clerk_user_id());

-- 6. Create secure product policies (NO anonymous access)
CREATE POLICY "Authenticated users can view active products"
ON public.products FOR SELECT
TO authenticated
USING (status = 'active');

CREATE POLICY "Authenticated users can create own products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (seller_id = public.get_clerk_user_id());

CREATE POLICY "Authenticated users can update own products"
ON public.products FOR UPDATE
TO authenticated
USING (seller_id = public.get_clerk_user_id())
WITH CHECK (seller_id = public.get_clerk_user_id());

CREATE POLICY "Authenticated users can delete own products"
ON public.products FOR DELETE
TO authenticated
USING (seller_id = public.get_clerk_user_id());

-- 7. Create secure triggers
CREATE OR REPLACE FUNCTION public.set_user_profile_mapping()
RETURNS TRIGGER AS $$
BEGIN
  -- Map clerk_user_id to user_profiles.id for products
  SELECT id INTO NEW.user_id 
  FROM public.user_profiles 
  WHERE clerk_user_id = NEW.seller_id;
  
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'User profile not found for seller_id %', NEW.seller_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_user_profile_mapping_trigger
  BEFORE INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_profile_mapping();

-- 8. Recreate product number generation
CREATE TRIGGER set_product_number_trigger
  BEFORE INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_product_number();

-- 9. Create indexes for performance
CREATE INDEX idx_user_profiles_clerk_user_id ON public.user_profiles(clerk_user_id);
CREATE INDEX idx_products_seller_id ON public.products(seller_id);
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_category ON public.products(category);

-- 10. Set up service role access for edge functions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;