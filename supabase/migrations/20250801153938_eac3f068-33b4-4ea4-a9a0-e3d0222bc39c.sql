-- Clean up existing user profiles and set up for new admin
DELETE FROM user_profiles WHERE role = 'admin';

-- Note: The new user profile will be created automatically by the edge function
-- when the user logs in with the new Clerk account