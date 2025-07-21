-- Update user_profiles table role enum to include 'blocked' status
ALTER TYPE user_role RENAME TO user_role_old;
CREATE TYPE user_role AS ENUM ('user', 'admin', 'blocked');
ALTER TABLE user_profiles ALTER COLUMN role TYPE user_role USING role::text::user_role;
DROP TYPE user_role_old;