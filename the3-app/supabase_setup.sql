-- 기존에 자동 생성된 테이블이 있다면 충돌 방지를 위해 삭제합니다.
DROP TABLE IF EXISTS public.user_keys CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Create a table for user profiles (extends Supabase Auth implicitly)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
-- 1. Users can read their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- 2. Admins can read all profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 2. Create a table for user API keys (BYOK)
CREATE TABLE public.user_keys (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  gemini_key text,
  naver_client_id text,
  naver_client_secret text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for user_keys
ALTER TABLE public.user_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for user_keys
-- 1. Users can see their own keys
CREATE POLICY "Users can view own keys" 
  ON public.user_keys FOR SELECT 
  USING (auth.uid() = user_id);

-- 2. Users can insert/update their own keys
CREATE POLICY "Users can insert own keys" 
  ON public.user_keys FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keys" 
  ON public.user_keys FOR UPDATE 
  USING (auth.uid() = user_id);

-- 3. Create a trigger to automatically create a profile when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  -- Initialize empty keys
  INSERT INTO public.user_keys (user_id) VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger to the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
