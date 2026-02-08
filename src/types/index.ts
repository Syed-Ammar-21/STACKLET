export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  cover_url?: string;
  user_id?: string;
  created_at: string;
  updated_at?: string;
  summary?: string;
  email?: string;
  books?: string;
  category?: string;
}

export interface PreloadedBook {
  id: string;
  title: string;
  author: string;
  rating: number;
  cover_url?: string;
  created_at: string;
  updated_at?: string;
  summary?: string;
  category?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  rating: number;
  cover_url?: string;
  summary?: string;
  email?: string;
  books?: string;
  category?: string;
}

export type SortOption = 'date_newest' | 'date_oldest' | 'rating_highest' | 'rating_lowest';

export type GenreFilter = string | null;

export interface Category {
  name: string;
  count: number;
}
