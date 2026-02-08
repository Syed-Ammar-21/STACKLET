-- Add category to books table
-- This will help users organize their books better

-- Add category column (single selection)
ALTER TABLE books 
ADD COLUMN category VARCHAR(50) DEFAULT 'General';

-- Create index for better performance on category searches
CREATE INDEX idx_books_category ON books(category);

-- Add comment to explain the new column
COMMENT ON COLUMN books.category IS 'Book category (Fiction, Non-Fiction, Sci-Fi, etc.)';

-- Insert some default categories for reference
-- These will be used in the frontend dropdown
INSERT INTO books (title, author, category, user_id, books, created_at) 
VALUES 
  ('Category Reference', 'System', 'Fiction', NULL, 'system', NOW()),
  ('Category Reference', 'System', 'Non-Fiction', NULL, 'system', NOW()),
  ('Category Reference', 'System', 'Science Fiction', NULL, 'system', NOW()),
  ('Category Reference', 'System', 'Romance', NULL, 'system', NOW()),
  ('Category Reference', 'System', 'Mystery', NULL, 'system', NOW()),
  ('Category Reference', 'System', 'Biography', NULL, 'system', NOW()),
  ('Category Reference', 'System', 'Self-Help', NULL, 'system', NOW()),
  ('Category Reference', 'System', 'History', NULL, 'system', NOW()),
  ('Category Reference', 'System', 'Poetry', NULL, 'system', NOW()),
  ('Category Reference', 'System', 'General', NULL, 'system', NOW())
ON CONFLICT DO NOTHING; 