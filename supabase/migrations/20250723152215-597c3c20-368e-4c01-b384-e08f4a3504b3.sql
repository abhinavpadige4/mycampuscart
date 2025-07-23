-- CRITICAL SECURITY FIXES MIGRATION (CORRECTED)
-- This migration addresses privilege escalation and RLS vulnerabilities

-- 1. Create secure function to get current user role (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE sql 
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT COALESCE(
    (SELECT role::text FROM public.user_profiles WHERE clerk_user_id = (auth.jwt() ->> 'sub')),
    'user'
  );
$$;

-- 2. Drop all existing problematic RLS policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.user_profiles;

-- 3. Create secure user_profiles RLS policies (authenticated users only)
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (clerk_user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  clerk_user_id = (auth.jwt() ->> 'sub') AND
  role = 'user' -- New users always start as 'user' role
);

CREATE POLICY "Users can update their own profile (except role)"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (clerk_user_id = (auth.jwt() ->> 'sub'))
WITH CHECK (
  clerk_user_id = (auth.jwt() ->> 'sub')
);

CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update user roles"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

-- 4. Fix products table policies (remove anonymous access)
DROP POLICY IF EXISTS "Users can view products" ON public.products;
DROP POLICY IF EXISTS "Users can view active products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

-- Create authenticated-only product policies
CREATE POLICY "Authenticated users can view active products"
ON public.products
FOR SELECT
TO authenticated
USING (status = 'active');

-- 5. Ensure products policies require authentication
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Users can insert products" ON public.products;

CREATE POLICY "Authenticated users can create products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  user_id = auth.uid()
);

-- 6. Create secure admin verification function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT public.get_current_user_role() = 'admin';
$$;

-- 7. Create role change prevention trigger
CREATE OR REPLACE FUNCTION public.prevent_role_self_change()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow role changes by admins
  IF OLD.role != NEW.role AND public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for role change prevention
DROP TRIGGER IF EXISTS prevent_role_self_change_trigger ON public.user_profiles;
CREATE TRIGGER prevent_role_self_change_trigger
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_change();

-- 8. Set default role to 'user' for user_profiles
ALTER TABLE public.user_profiles 
ALTER COLUMN role SET DEFAULT 'user';