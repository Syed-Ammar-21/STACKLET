-- Migration: Create profiles table (per-user logic)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  email text UNIQUE,
  created_at timestamp with time zone DEFAULT now()
); 