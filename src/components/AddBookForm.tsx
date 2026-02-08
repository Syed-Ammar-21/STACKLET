
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Book, BookFormData } from '@/types';

interface AddBookFormProps {
  onSubmit: (bookData: BookFormData) => Promise<void>;
  editingBook?: Book | null;
  onCancel?: () => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({ onSubmit, editingBook, onCancel }) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    rating: 5,
    review: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        rating: editingBook.rating,
        review: editingBook.review || ''
      });
    }
  }, [editingBook]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      if (!editingBook) {
        setFormData({
          title: '',
          author: '',
          rating: 5,
          review: ''
        });
      }
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof BookFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="add-book-form w-full max-w-4xl mx-auto shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
        <CardTitle className="text-2xl font-bold text-gray-800">
          {editingBook ? '📖 Edit Book Details' : '📚 Add New Book to Your Library'}
        </CardTitle>
        <p className="text-gray-600 mt-2">
          {editingBook ? 'Update your book information' : 'Fill in the details below. Cover image will be automatically fetched!'}
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="text-lg font-semibold text-gray-700">Book Title *</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                className="title-input mt-2 h-12 text-lg"
                placeholder="Enter the book title"
              />
            </div>
            
            <div>
              <Label htmlFor="author" className="text-lg font-semibold text-gray-700">Author *</Label>
              <Input
                id="author"
                type="text"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                required
                className="author-input mt-2 h-12 text-lg"
                placeholder="Enter the author's name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rating" className="text-lg font-semibold text-gray-700">Rating (1-5) *</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => handleChange('rating', parseInt(e.target.value))}
              required
              className="rating-input mt-2 h-12 text-lg"
            />
            <p className="text-sm text-gray-500 mt-1">Rate this book from 1 to 5 stars</p>
          </div>

          <div>
            <Label htmlFor="review" className="text-lg font-semibold text-gray-700">Review/Notes</Label>
            <Textarea
              id="review"
              value={formData.review}
              onChange={(e) => handleChange('review', e.target.value)}
              placeholder="Share your thoughts, favorite quotes, or memorable moments from this book..."
              className="notes-input min-h-[120px] mt-2 text-lg"
            />
            <p className="text-sm text-gray-500 mt-1">Optional: Add your personal notes or review</p>
          </div>

          <div className="form-actions flex gap-4 pt-6 border-t border-gray-200">
            <Button 
              type="submit" 
              className="submit-btn flex-1 md:flex-none bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editingBook ? 'Updating...' : 'Adding to Library...'}
                </div>
              ) : (
                editingBook ? '📝 Update Book' : '📚 Add to Library'
              )}
            </Button>
            {editingBook && onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="cancel-btn px-8 py-3 rounded-xl"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBookForm;
