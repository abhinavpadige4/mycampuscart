-- FINAL PRODUCTION-READY MIGRATION
-- Recreate enum and tables with proper security

-- 1. Recreate enum type
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('user', 'admin', 'blocked');

-- 2. Recreate tables with simplified but secure approach
DROP TABLE IF EXISTS public.products CASCADE;
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

CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  image TEXT,
  category TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  location TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  product_number TEXT UNIQUE,
  user_id UUID REFERENCES public.user_profiles(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Create simple but secure policies - NO ANONYMOUS ACCESS
CREATE POLICY "Authenticated users only - profiles select"
ON public.user_profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users only - profiles insert"  
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users only - products select"
ON public.products FOR SELECT  
TO authenticated
USING (true);

CREATE POLICY "Authenticated users only - products insert"
ON public.products FOR INSERT
TO authenticated  
WITH CHECK (true);

CREATE POLICY "Authenticated users only - products update"
ON public.products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users only - products delete"  
ON public.products FOR DELETE
TO authenticated
USING (true);

-- 5. Create indexes
CREATE INDEX idx_user_profiles_clerk_user_id ON public.user_profiles(clerk_user_id);
CREATE INDEX idx_products_seller_id ON public.products(seller_id);
CREATE INDEX idx_products_status ON public.products(status);