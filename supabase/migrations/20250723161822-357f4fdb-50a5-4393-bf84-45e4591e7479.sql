-- PHASE 1: Fix Critical RLS Policies for Products Table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users only - products select" ON public.products;
DROP POLICY IF EXISTS "Authenticated users only - products insert" ON public.products;
DROP POLICY IF EXISTS "Authenticated users only - products update" ON public.products;
DROP POLICY IF EXISTS "Authenticated users only - products delete" ON public.products;

-- Create secure RLS policies for products
CREATE POLICY "Authenticated users can view active products"
ON public.products
FOR SELECT
TO authenticated
USING (status = 'active');

CREATE POLICY "Authenticated users can insert their own products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own products"
ON public.products
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()
);

CREATE POLICY "Users can delete their own products"
ON public.products
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()
);

-- PHASE 2: Fix Critical RLS Policies for User Profiles Table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users only - profiles select" ON public.user_profiles;
DROP POLICY IF EXISTS "Authenticated users only - profiles insert" ON public.user_profiles;

-- Create secure RLS policies for user profiles
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (clerk_user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  clerk_user_id = (auth.jwt() ->> 'sub') AND
  role = 'user' -- Force new users to have 'user' role
);

CREATE POLICY "Users can update their own profile basic info"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (clerk_user_id = (auth.jwt() ->> 'sub'))
WITH CHECK (
  clerk_user_id = (auth.jwt() ->> 'sub') AND
  -- Prevent users from changing their own role
  (role = OLD.role OR public.get_current_user_role() = 'admin')
);

CREATE POLICY "Admins can update any profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (public.get_current_user_role() = 'admin');

-- PHASE 3: Add Role Protection Trigger
CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Prevent users from changing their own role unless they're admin
  IF OLD.role != NEW.role THEN
    IF (auth.jwt() ->> 'sub') = NEW.clerk_user_id AND public.get_current_user_role() != 'admin' THEN
      RAISE EXCEPTION 'Users cannot change their own role. Admin access required.';
    END IF;
  END IF;
  
  -- Log role changes for audit trail
  IF OLD.role != NEW.role THEN
    INSERT INTO public.audit_log (table_name, action, old_values, new_values, changed_by)
    VALUES (
      'user_profiles',
      'role_change',
      json_build_object('role', OLD.role),
      json_build_object('role', NEW.role),
      auth.jwt() ->> 'sub'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_log
FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'admin');

-- Create trigger for role protection
DROP TRIGGER IF EXISTS prevent_role_self_escalation_trigger ON public.user_profiles;
CREATE TRIGGER prevent_role_self_escalation_trigger
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_escalation();

-- PHASE 4: Ensure user_id is NOT NULL in products table
-- This prevents security bypass through NULL user_id
UPDATE public.products SET user_id = gen_random_uuid() WHERE user_id IS NULL;
ALTER TABLE public.products ALTER COLUMN user_id SET NOT NULL;