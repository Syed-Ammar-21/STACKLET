import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookFormData, Book } from '@/types';
import { bookService, fetchBookCover } from '@/services/bookService';
import CategorySelect from './CategorySelect';

interface BookFormProps {
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel: () => void;
  editingBook?: Book | null;
  loading?: boolean;
  importMode?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, onCancel, editingBook, loading, importMode }) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    rating: 5,
    cover_url: '',
    summary: '',
    category: 'General',
  });

  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        rating: editingBook.rating,
        cover_url: editingBook.cover_url || '',
        summary: editingBook.summary || '',
        category: editingBook.category || 'General',
      });
    }
  }, [editingBook]);

  // Auto-search for cover when title and author are both entered
  useEffect(() => {
    const searchForCover = async () => {
      if (formData.title.trim() && formData.author.trim() && !editingBook) {
        setSearching(true);
        setSearchMessage('Searching for cover image...');
        try {
          const coverUrl = await fetchBookCover(formData.title, formData.author);
          if (coverUrl) {
            setFormData(prev => ({ ...prev, cover_url: coverUrl }));
            setSearchMessage('✅ Cover image found and auto-filled!');
            setTimeout(() => setSearchMessage(''), 3000);
          } else {
            setSearchMessage('❌ No cover found. You can enter a URL manually.');
          }
        } catch {
          setSearchMessage('❌ Error searching for cover. You can enter a URL manually.');
        } finally {
          setSearching(false);
        }
      }
    };
    // Only search if cover_url is empty (user hasn't set it)
    if (formData.title && formData.author && !formData.cover_url && !editingBook) {
      const timeoutId = setTimeout(searchForCover, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.title, formData.author, formData.cover_url, editingBook]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-lg font-semibold text-gray-800 font-['Orbitron',monospace]">
              Book Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter book title"
              required
              className="mt-2 h-12 text-lg text-gray-800 font-['Orbitron',monospace]"
            />
          </div>

          <div>
            <Label htmlFor="author" className="text-lg font-semibold text-gray-800 font-['Orbitron',monospace]">
              Author *
            </Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Enter author name"
              required
              className="mt-2 h-12 text-lg text-gray-800 font-['Orbitron',monospace]"
            />
          </div>

          <div>
            <Label htmlFor="cover_url" className="text-lg font-semibold text-gray-800 font-['Orbitron',monospace]">
              Cover Image URL {(!editingBook && '(Auto-filled if found in library)')}
            </Label>
            <Input
              id="cover_url"
              type="url"
              value={formData.cover_url}
              onChange={(e) => setFormData(prev => ({ ...prev, cover_url: e.target.value }))}
              placeholder={editingBook ? "Enter cover image URL" : "Will auto-fill if book found in library"}
              className="mt-2 h-12 text-lg text-gray-800 font-['Orbitron',monospace]"
              disabled={searching}
            />
            {searchMessage && (
              <p className={`text-sm mt-1 ${searchMessage.includes('✅') ? 'text-green-600' : searchMessage.includes('❌') ? 'text-red-600' : 'text-blue-600'}`}>
                {searching && '⏳ '}{searchMessage}
              </p>
            )}
            {!editingBook && !searchMessage && (
              <p className="text-sm text-gray-500 mt-1">
                Enter title and author above to auto-search library database
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="rating" className="text-lg font-semibold text-gray-800 font-['Orbitron',monospace]">
              Rating (1-5) *
            </Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
              className="mt-2 h-12 text-lg text-gray-800 font-['Orbitron',monospace]"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-lg font-semibold text-gray-800 font-['Orbitron',monospace]">
              Genre *
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Enter genre (e.g. Fiction, Romance, etc.)"
              required
              className="mt-2 h-12 text-lg text-gray-800 font-['Orbitron',monospace]"
            />
          </div>

          <div>
            <Label htmlFor="summary" className="text-lg font-semibold text-gray-800 font-['Orbitron',monospace]">
             Notes *
            </Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Write your thoughts, notes, or summary about this book..."
              required
              className="mt-2 h-12 text-lg text-gray-800 font-['Orbitron',monospace]"
            />
            <p className="text-sm text-gray-500 mt-1">
              Add your personal notes, thoughts, or summary about this book
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl font-['Orbitron',monospace]"
            >
              {loading ? 'Saving...' : (importMode ? 'Import Book' : (editingBook ? 'Update Book' : 'Add Book'))}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl font-['Orbitron',monospace]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookForm;
