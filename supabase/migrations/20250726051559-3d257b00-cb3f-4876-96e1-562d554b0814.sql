-- Create likes table for product likes functionality
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create policies for likes
CREATE POLICY "Users can view all likes"
ON public.likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own likes" 
ON public.likes 
FOR INSERT 
WITH CHECK (user_id = (
  SELECT id FROM user_profiles 
  WHERE clerk_user_id = (auth.jwt() ->> 'sub')
));

CREATE POLICY "Users can delete their own likes" 
ON public.likes 
FOR DELETE 
USING (user_id = (
  SELECT id FROM user_profiles 
  WHERE clerk_user_id = (auth.jwt() ->> 'sub')
));

-- Create an index for better performance
CREATE INDEX idx_likes_user_product ON public.likes(user_id, product_id);
CREATE INDEX idx_likes_product ON public.likes(product_id);