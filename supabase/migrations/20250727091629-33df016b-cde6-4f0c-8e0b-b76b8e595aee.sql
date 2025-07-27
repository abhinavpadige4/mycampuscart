-- Grant admin role to the specified email
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'abhinavpadige06@gmail.com';

-- If the user doesn't exist yet, we'll handle it in the edge function
-- Let's also ensure our RLS policies work correctly with the clerk integration