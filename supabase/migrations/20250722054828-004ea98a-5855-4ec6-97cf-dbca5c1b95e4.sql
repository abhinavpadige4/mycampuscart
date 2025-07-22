-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.generate_product_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN 'PROD-' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || floor(random() * 1000);
END;
$$;

CREATE OR REPLACE FUNCTION public.set_product_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    IF NEW.product_number IS NULL THEN
        NEW.product_number := generate_product_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_user_id_on_products()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    IF NEW.user_id IS NULL THEN
        NEW.user_id := auth.uid();
    END IF;
    RETURN NEW;
END;
$$;

-- Ensure triggers exist
DROP TRIGGER IF EXISTS set_product_number_trigger ON public.products;
CREATE TRIGGER set_product_number_trigger
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.set_product_number();

DROP TRIGGER IF EXISTS set_user_id_on_products_trigger ON public.products;
CREATE TRIGGER set_user_id_on_products_trigger
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.set_user_id_on_products();