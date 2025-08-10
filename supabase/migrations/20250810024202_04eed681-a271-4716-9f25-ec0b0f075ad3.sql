-- Drop the function with CASCADE to remove dependent trigger
DROP FUNCTION IF EXISTS prevent_role_self_change() CASCADE;

-- Update admin emails - set help.mycampuscart@gmail.com as admin, others as user
UPDATE user_profiles 
SET role = CASE 
  WHEN email IN ('help.mycampuscart@gmail.com', 'abhinavpadige06@gmail.com') THEN 'admin'
  ELSE 'user'
END;

-- Recreate the function with updated admin email checks
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
     NEW.email NOT IN ('help.mycampuscart@gmail.com', 'abhinavpadige06@gmail.com') THEN
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