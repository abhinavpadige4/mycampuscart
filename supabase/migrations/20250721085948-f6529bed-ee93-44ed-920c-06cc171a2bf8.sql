-- Create user_role enum type
CREATE TYPE user_role AS ENUM ('user', 'admin', 'blocked');

-- First remove the default value, then change the type, then add the default back
ALTER TABLE user_profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE user_profiles ALTER COLUMN role TYPE user_role USING role::user_role;
ALTER TABLE user_profiles ALTER COLUMN role SET DEFAULT 'user'::user_role;