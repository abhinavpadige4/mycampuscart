-- Fix RLS policies for products table
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.products;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.products;
DROP POLICY IF EXISTS "Allow logged-in users to insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can create products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;

-- Create proper RLS policies
CREATE POLICY "Users can view active products" 
ON public.products 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can insert their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own products" 
ON public.products 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own products" 
ON public.products 
FOR DELETE 
USING (user_id = auth.uid());

-- Ensure user_id is set properly when creating products
CREATE OR REPLACE FUNCTION public.set_user_id_on_products()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NULL THEN
        NEW.user_id := auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_user_id_on_products_trigger
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.set_user_id_on_products();