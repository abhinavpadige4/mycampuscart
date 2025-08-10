-- Temporarily disable the trigger
DROP TRIGGER IF EXISTS prevent_role_change_trigger ON user_profiles;

-- Update the current user to admin status
UPDATE user_profiles 
SET role = 'admin' 
WHERE clerk_user_id = 'user_30lC6HlebzYQQIqxS2rVW0hY7MO';

-- Re-enable the trigger
CREATE TRIGGER prevent_role_change_trigger
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_role_self_change();