-- Create user_profiles table for Clerk integration
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role based on Clerk ID
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_profiles WHERE clerk_user_id = (auth.jwt() ->> 'sub')),
    'user'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_current_user_role() = 'admin';
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create trigger to prevent users from changing their own role
CREATE OR REPLACE FUNCTION public.prevent_role_self_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow role changes by admins
  IF OLD.role != NEW.role AND public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER prevent_role_self_change_trigger
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_change();

-- Add RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (clerk_user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (clerk_user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (clerk_user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" 
ON public.user_profiles 
FOR UPDATE 
USING (public.is_admin());

-- Update products table RLS policies to work with Clerk
DROP POLICY IF EXISTS "Users can create their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can view active products" ON public.products;

-- Create new RLS policies for products that work with Clerk
CREATE POLICY "Users can create their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  user_id = (
    SELECT id FROM public.user_profiles 
    WHERE clerk_user_id = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can update their own products" 
ON public.products 
FOR UPDATE 
USING (
  user_id = (
    SELECT id FROM public.user_profiles 
    WHERE clerk_user_id = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can delete their own products" 
ON public.products 
FOR DELETE 
USING (
  user_id = (
    SELECT id FROM public.user_profiles 
    WHERE clerk_user_id = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Everyone can view active products" 
ON public.products 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Admins can view all products" 
ON public.products 
FOR SELECT 
USING (public.is_admin());

-- Add updated_at trigger for user_profiles
CREATE TRIGGER handle_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add indexes for performance
CREATE INDEX idx_user_profiles_clerk_user_id ON public.user_profiles(clerk_user_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);