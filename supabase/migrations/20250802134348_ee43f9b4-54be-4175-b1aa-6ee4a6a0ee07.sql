-- Temporarily disable the role change prevention trigger
DROP TRIGGER IF EXISTS prevent_role_self_change_trigger ON user_profiles;

-- Set the specific user as admin
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'abhinavpadige06@gmail.com';

-- Recreate the trigger with improved logic
CREATE OR REPLACE FUNCTION public.prevent_role_self_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Allow role changes by admins or for the first time admin setup
  IF OLD.role != NEW.role AND public.get_current_user_role() != 'admin' AND NEW.email != 'abhinavpadige06@gmail.com' THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER prevent_role_self_change_trigger
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_role_self_change();

-- Update the first user trigger to handle your specific email
DROP TRIGGER IF EXISTS on_first_user_admin ON user_profiles;

CREATE OR REPLACE FUNCTION public.set_first_user_as_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    user_count INTEGER;
BEGIN
    -- Check if this is the first user
    SELECT COUNT(*) INTO user_count FROM public.user_profiles;
    
    -- If this is the first user or the email matches admin, make them admin
    IF user_count = 0 OR NEW.email = 'abhinavpadige06@gmail.com' THEN
        NEW.role := 'admin';
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Create the trigger
CREATE TRIGGER on_first_user_admin
    BEFORE INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_first_user_as_admin();