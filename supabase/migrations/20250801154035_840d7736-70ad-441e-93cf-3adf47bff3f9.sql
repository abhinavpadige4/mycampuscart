-- Create a function to set the first user as admin
CREATE OR REPLACE FUNCTION public.set_first_user_as_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_count INTEGER;
BEGIN
    -- Check if this is the first user
    SELECT COUNT(*) INTO user_count FROM public.user_profiles;
    
    -- If this is the first user, make them admin
    IF user_count = 0 THEN
        NEW.role := 'admin';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to run before insert on user_profiles
CREATE OR REPLACE TRIGGER set_first_user_admin_trigger
    BEFORE INSERT ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_first_user_as_admin();