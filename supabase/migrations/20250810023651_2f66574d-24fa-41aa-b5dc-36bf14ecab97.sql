-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS prevent_role_change_trigger ON user_profiles;
DROP FUNCTION IF EXISTS prevent_role_self_change();

-- Update the current user to admin status
UPDATE user_profiles 
SET role = 'admin' 
WHERE clerk_user_id = 'user_30lC6HlebzYQQIqxS2rVW0hY7MO' OR email = 'abhinavpadige4@gmail.com';

-- Recreate the function with proper admin email checks
CREATE OR REPLACE FUNCTION public.prevent_role_self_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Allow role changes by admins or for admin email addresses
  IF OLD.role != NEW.role AND 
     public.get_current_user_role() != 'admin' AND 
     NEW.email NOT IN ('abhinavpadige06@gmail.com', 'abhinavpadige4@gmail.com') THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER prevent_role_change_trigger
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_role_self_change();