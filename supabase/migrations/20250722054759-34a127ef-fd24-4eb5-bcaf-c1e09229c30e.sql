-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.generate_product_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN 'PROD-' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || floor(random() * 1000);
END;
$$;

CREATE OR REPLACE FUNCTION public.set_product_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    IF NEW.product_number IS NULL THEN
        NEW.product_number := generate_product_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_user_id_on_products()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    IF NEW.user_id IS NULL THEN
        NEW.user_id := auth.uid();
    END IF;
    RETURN NEW;
END;
$$;

-- Ensure triggers exist
DROP TRIGGER IF EXISTS set_product_number_trigger ON public.products;
CREATE TRIGGER set_product_number_trigger
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.set_product_number();

DROP TRIGGER IF EXISTS set_user_id_on_products_trigger ON public.products;
CREATE TRIGGER set_user_id_on_products_trigger
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.set_user_id_on_products();

-- Fix user_profiles RLS policies to be more secure
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;

-- Create secure function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE sql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role FROM public.user_profiles WHERE clerk_user_id = (auth.jwt() ->> 'sub');
$$;

-- More restrictive user_profiles policies
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (clerk_user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (clerk_user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (clerk_user_id = (auth.jwt() ->> 'sub'))
WITH CHECK (
  clerk_user_id = (auth.jwt() ->> 'sub') AND
  -- Prevent users from changing their own role unless they're admin
  (role = OLD.role OR public.get_current_user_role() = 'admin')
);

CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update any profile"
ON public.user_profiles
FOR UPDATE
USING (public.get_current_user_role() = 'admin');

-- Make user_id NOT NULL for products table
ALTER TABLE public.products ALTER COLUMN user_id SET NOT NULL;