import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const PORT = process.env.PORT || 3001;



// Supabase client setup
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://mbaeejjxujzzfvrhurcy.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Service role key for server-side operations
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iYWVlamp4dWp6emZ2cmh1cmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjA1NjYsImV4cCI6MjA2NjI5NjU2Nn0.PenTqYKE-yb4WeWvLhR2QWs8KeDuXtsTYM9uX7_meHU";

// Use service key if available, otherwise use anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY);

// API Key for simple authentication (you can change this)
const API_KEY = process.env.API_KEY || "stacklet-api-key-2024";

// Middleware to check API key authentication
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Valid API key required. Use X-API-Key header or Authorization: Bearer token' 
    });
  }
  
  next();
};

// GET /api/books - Fetch user books by email with optional filters
// POST /api/books - Add a new book for a user
app.post('/api/books', authenticateApiKey, async (req, res) => {
  try {
    const { email, title, author, rating, coverUrl, summary, genre } = req.body;

    if (!email || !title || !author) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email, title, and author are required',
      });
    }

    // Get user profile by email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'No user found with the provided email address',
      });
    }

    // Duplicate check: does this user already have a book with this title?
    const { data: existingBook, error: checkError } = await supabase
      .from('books')
      .select('id')
      .eq('user_id', profile.id)
      .ilike('title', title) // case-insensitive match
      .maybeSingle();

    if (checkError) {
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to check for duplicate book',
        details: checkError.message,
      });
    }

    if (existingBook) {
      return res.status(400).json({
        error: 'Duplicate Book',
        message: 'Book already in current user library',
      });
    }

    // Insert new book
    const { data: book, error: insertError } = await supabase
      .from('books')
      .insert([
        {
          user_id: profile.id,
          books: email, // Insert user's email into 'books' column
          title,
          author,
          rating: rating || null,
          cover_url: coverUrl || null,
          summary: summary || null,
          category: genre || null,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to add book',
        details: insertError.message,
      });
    }

    res.status(201).json({
      message: 'Book added successfully',
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        rating: book.rating,
        coverUrl: book.cover_url,
        summary: book.summary,
        genre: book.category,
        date_added: book.created_at,
        updated_at: book.updated_at,
      },
    });
  } catch (error) {
    console.error('POST /api/books error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }
});

// PATCH /api/books/:id - Update a book for a user
app.patch('/api/books/:id', authenticateApiKey, async (req, res) => {
  try {
    const { email, ...fields } = req.body;
    const { id } = req.params;

    if (!email || !id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and book ID are required',
      });
    }

    // Get user profile by email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'No user found with the provided email address',
      });
    }

    // Check book ownership
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id, user_id')
      .eq('id', id)
      .single();
    if (bookError || !book || book.user_id !== profile.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Book not found or does not belong to user',
      });
    }

    // Prepare update fields
    const updateFields = {};
    if (fields.title !== undefined) updateFields.title = fields.title;
    if (fields.author !== undefined) updateFields.author = fields.author;
    if (fields.rating !== undefined) updateFields.rating = fields.rating;
    if (fields.coverUrl !== undefined) updateFields.cover_url = fields.coverUrl;
    if (fields.summary !== undefined) updateFields.summary = fields.summary;
    if (fields.genre !== undefined) updateFields.category = fields.genre;

    // Update book
    const { data: updatedBook, error: updateError } = await supabase
      .from('books')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to update book',
        details: updateError.message,
      });
    }

    res.json({
      message: 'Book updated successfully',
      book: {
        id: updatedBook.id,
        title: updatedBook.title,
        author: updatedBook.author,
        rating: updatedBook.rating,
        coverUrl: updatedBook.cover_url,
        summary: updatedBook.summary,
        genre: updatedBook.category,
        date_added: updatedBook.created_at,
        updated_at: updatedBook.updated_at,
      },
    });
  } catch (error) {
    console.error('PATCH /api/books/:id error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }
});

// DELETE /api/books/:id - Delete a book for a user
app.delete('/api/books/:id', authenticateApiKey, async (req, res) => {
  try {
    const { email } = req.body;
    const { id } = req.params;

    if (!email || !id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and book ID are required',
      });
    }

    // Get user profile by email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'No user found with the provided email address',
      });
    }

    // Check book ownership
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id, user_id')
      .eq('id', id)
      .single();
    if (bookError || !book || book.user_id !== profile.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Book not found or does not belong to user',
      });
    }

    // Delete book
    const { error: deleteError } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to delete book',
        details: deleteError.message,
      });
    }

    res.json({
      message: 'Book deleted successfully',
      bookId: id,
    });
  } catch (error) {
    console.error('DELETE /api/books/:id error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }
});

app.get('/api/books', authenticateApiKey, async (req, res) => {
  try {
    const { email, genre, title, author } = req.query;

    // Validate required email parameter
    if (!email) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Email parameter is required' 
      });
    }

    // First, get user profile by email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ 
        error: 'User Not Found', 
        message: 'No user found with the provided email address' 
      });
    }

    // Fetch all books for this user by matching email (for legacy compatibility)
    // Build query for books with optional filters
    let booksQuery = supabase
      .from('books')
      .select('id, title, author, rating, cover_url, summary, category, created_at, updated_at')
      .eq('user_id', profile.id);

    // Optional filters
    if (genre) {
      booksQuery = booksQuery.ilike('category', `%${genre}%`);
    }
    if (title) {
      booksQuery = booksQuery.ilike('title', `%${title}%`);
    }
    if (author) {
      booksQuery = booksQuery.ilike('author', `%${author}%`);
    }

    booksQuery = booksQuery.order('created_at', { ascending: false });

    const { data: books, error: booksError } = await booksQuery;

    if (booksError) {
      console.error('Books query error:', booksError);
      return res.status(500).json({ 
        error: 'Database Error', 
        message: 'Failed to fetch books' 
      });
    }

    // Map books to use correct field names for API consumers
    const booksMapped = (books || []).map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      rating: book.rating,
      coverUrl: book.cover_url, // Use camelCase for API response
      summary: book.summary,
      genre: book.category, // Map category to genre
      date_added: book.created_at,
      updated_at: book.updated_at
    }));

    // Format response
    const response = {
      user: {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email
      },
      books: booksMapped,
      total_books: booksMapped.length
    };

    res.json(response);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'An unexpected error occurred' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Stacklet API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Stacklet API Server',
    version: '1.0.0',
    endpoints: {
      'GET /api/health': 'Health check',
      'GET /api/books': 'Fetch user books by email with optional filters'
    },
    authentication: 'API Key required (X-API-Key header or Authorization: Bearer token)',
    example_usage: {
      url: '/api/books?email=user@example.com&genre=fiction&title=harry',
      headers: {
        'X-API-Key': 'your-api-key-here'
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Stacklet API Server running on http://localhost:${PORT}`);
  console.log(`📚 Books endpoint: http://localhost:${PORT}/api/books`);
  console.log(`🔑 API Key: ${API_KEY}`);
});

export default app;
