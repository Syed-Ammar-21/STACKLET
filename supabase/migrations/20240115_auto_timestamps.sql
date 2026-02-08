-- Enable automatic timestamp handling for books table
-- This ensures created_at and updated_at are auto-filled by Supabase

-- Function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at when book is modified
CREATE TRIGGER update_books_updated_at 
    BEFORE UPDATE ON books 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure created_at has a default value (if not already set)
ALTER TABLE books 
ALTER COLUMN created_at SET DEFAULT NOW();

-- Ensure updated_at has a default value (if not already set)
ALTER TABLE books 
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Add comment to explain the auto-fill behavior
COMMENT ON TABLE books IS 'Books table with automatic timestamp handling. created_at and updated_at are auto-filled by Supabase.'; 