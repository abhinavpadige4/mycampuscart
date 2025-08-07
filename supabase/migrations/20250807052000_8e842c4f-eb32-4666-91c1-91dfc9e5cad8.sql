-- Create user profile for the current Clerk user if it doesn't exist
INSERT INTO public.user_profiles (clerk_user_id, email, role, first_name, last_name)
VALUES ('user_30lC6HlebzYQQIqxS2rVW0hY7MO', 'user@example.com', 'user', 'User', 'Name')
ON CONFLICT (clerk_user_id) DO NOTHING;