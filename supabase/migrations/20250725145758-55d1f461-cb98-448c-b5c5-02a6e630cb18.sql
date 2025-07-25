-- Fix security warning: Add search_path to security definer functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_profiles WHERE clerk_user_id = (auth.jwt() ->> 'sub')),
    'user'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT public.get_current_user_role() = 'admin';
$$;

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