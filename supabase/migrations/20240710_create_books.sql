-- Migration: Create books table (cleaned up for per-user logic)
CREATE TABLE IF NOT EXISTS public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  rating integer,
  cover_url text,
  summary text,
  category varchar(50) DEFAULT 'General',
  user_id uuid NOT NULL,
  books text NOT NULL, -- This will store the user's email
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own books
CREATE POLICY "Allow users to insert their own books"
ON books
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to select their own books
CREATE POLICY "Allow users to select their own books"
ON books
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to update their own books
CREATE POLICY "Allow users to update their own books"
ON books
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own books
CREATE POLICY "Allow users to delete their own books"
ON books
FOR DELETE
USING (auth.uid() = user_id); 