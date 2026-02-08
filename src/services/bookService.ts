import { supabase } from '@/integrations/supabase/client';
import { BookFormData } from '@/types';

export const bookService = {
  async addBook(bookData: BookFormData): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First check if book with same title (case-insensitive) exists
    const { data: existingBook } = await supabase
      .from('books')
      .select('id')
      .eq('user_id', user.id)
      .ilike('title', bookData.title.trim())
      .maybeSingle();

    if (existingBook) {
      throw new Error('A book with this title already exists in your library');
    }

    const { error } = await supabase
      .from('books')
      .insert([{
        title: bookData.title.trim(),
        author: bookData.author.trim(),
        rating: bookData.rating,
        cover_url: bookData.cover_url,
        summary: bookData.summary?.trim(),
        category: bookData.category?.trim() || 'General',
        user_id: user.id,
        books: user.email,
      }]);
    if (error) throw error;
  },

  async getBooks(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async bookExistsByTitle(title: string): Promise<boolean> {
    if (!title?.trim()) return false;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    const { data, error } = await supabase
      .from('books')
      .select('id')
      .eq('user_id', user.id)
      .ilike('title', title.trim())
      .maybeSingle();
    if (error) throw error;
    return !!data;
  },

  async deleteBook(id: string): Promise<void> {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async updateBook(id: string, bookData: BookFormData): Promise<void> {
    const { error } = await supabase
      .from('books')
      .update({
        title: bookData.title,
        author: bookData.author,
        rating: bookData.rating,
        cover_url: bookData.cover_url,
        summary: bookData.summary,
        category: bookData.category || 'General',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) throw error;
  }
};

export async function fetchBookCover(title: string, author: string): Promise<string | null> {
  try {
    const searchQuery = encodeURIComponent(`${title} ${author}`);
    const response = await fetch(`https://openlibrary.org/search.json?q=${searchQuery}&limit=1`);
    const data = await response.json();
    if (data.docs && data.docs.length > 0) {
      const book = data.docs[0];
      if (book.isbn && book.isbn.length > 0) {
        return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`;
      }
      if (book.cover_i) {
        return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
      }
    }
    return null;
  } catch {
    return null;
  }
}
