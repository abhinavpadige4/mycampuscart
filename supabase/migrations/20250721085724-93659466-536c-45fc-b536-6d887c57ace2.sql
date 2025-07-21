-- Add unique product number to products table
ALTER TABLE public.products 
ADD COLUMN product_number VARCHAR(10) UNIQUE;

-- Create sequence for product numbers
CREATE SEQUENCE IF NOT EXISTS product_number_seq START 10001;

-- Create function to generate unique product number
CREATE OR REPLACE FUNCTION generate_product_number()
RETURNS VARCHAR(10) AS $$
DECLARE
    new_number VARCHAR(10);
BEGIN
    new_number := 'P' || LPAD(nextval('product_number_seq')::text, 5, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate product number on insert
CREATE OR REPLACE FUNCTION set_product_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.product_number IS NULL THEN
        NEW.product_number := generate_product_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_product_number
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION set_product_number();

-- Update existing products with unique numbers
UPDATE public.products 
SET product_number = generate_product_number() 
WHERE product_number IS NULL;