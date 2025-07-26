-- Grant admin access to abhinavpadige06@gmail.com
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'abhinavpadige06@gmail.com';

-- If the user doesn't exist in user_profiles yet, we can't update them
-- They will get admin role when they first sign in through the edge function