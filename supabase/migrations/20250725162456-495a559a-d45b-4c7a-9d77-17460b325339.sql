-- Remove the condition column from products table since we removed it from the form
ALTER TABLE products DROP COLUMN IF EXISTS condition;

-- Add a default condition if the column can't be dropped due to constraints
-- UPDATE products SET condition = 'good' WHERE condition IS NULL;
-- ALTER TABLE products ALTER COLUMN condition SET DEFAULT 'good';