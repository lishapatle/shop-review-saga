-- Create user profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'store_owner', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  category TEXT,
  image_url TEXT,
  average_rating DECIMAL(2,1) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for stores
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Store policies
CREATE POLICY "Anyone can view stores" 
ON public.stores 
FOR SELECT 
USING (true);

CREATE POLICY "Store owners can create stores" 
ON public.stores 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Store owners can update their stores" 
ON public.stores 
FOR UPDATE 
USING (auth.uid() = owner_id);

-- Create ratings table  
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, store_id)
);

-- Enable RLS for ratings
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Rating policies
CREATE POLICY "Anyone can view ratings" 
ON public.ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create ratings" 
ON public.ratings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to update store average rating
CREATE OR REPLACE FUNCTION public.update_store_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.stores 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM public.ratings 
      WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)
    ),
    total_ratings = (
      SELECT COUNT(*) 
      FROM public.ratings 
      WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)
    )
  WHERE id = COALESCE(NEW.store_id, OLD.store_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to update store ratings
CREATE TRIGGER update_store_rating_on_insert
  AFTER INSERT ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_store_rating();

CREATE TRIGGER update_store_rating_on_update
  AFTER UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_store_rating();

CREATE TRIGGER update_store_rating_on_delete
  AFTER DELETE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_store_rating();