-- Create user_role enum type
CREATE TYPE user_role AS ENUM ('user', 'admin', 'blocked');

-- Update user_profiles table role column to use the enum
ALTER TABLE user_profiles 
ALTER COLUMN role TYPE user_role 
USING role::user_role;