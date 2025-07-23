-- Make user_id NOT NULL for products table and add default
ALTER TABLE public.products ALTER COLUMN user_id SET DEFAULT auth.uid();
UPDATE public.products SET user_id = seller_id WHERE user_id IS NULL;
ALTER TABLE public.products ALTER COLUMN user_id SET NOT NULL;