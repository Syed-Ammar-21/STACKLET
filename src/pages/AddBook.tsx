import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BookForm from '@/components/BookForm';
import Navbar from '@/components/Navbar';
import { bookService } from '@/services/bookService';
import { BookFormData } from '@/types';
import { useToast } from '@/hooks/use-toast';

const AddBook: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Batch import logic
  const importedBooks = location.state?.importedBooks;

  useEffect(() => {
    if (Array.isArray(importedBooks) && importedBooks.length > 0) {
      (async () => {
        setLoading(true);
        let addedCount = 0;
        let errorCount = 0;
        for (const bookData of importedBooks) {
          try {
            await bookService.addBook(bookData);
            addedCount++;
          } catch (error) {
            errorCount++;
          }
        }
        setLoading(false);
        if (addedCount > 0) {
          toast({
            title: 'Success! 📚',
            description: `${addedCount} book${addedCount > 1 ? 's' : ''} added to your library!${errorCount > 0 ? ` (${errorCount} failed!)` : ''}`,
          });
        } else {
          toast({
            title: 'No Books Added.',
            description: 'No new books were added. All books failed to add.',
            variant: 'destructive',
          });
        }
        sessionStorage.setItem('fromBookForm', 'true');
        navigate('/');
      })();
    }
    // eslint-disable-next-line
  }, []);

  // Manual add logic
  const handleSubmit = async (bookData: BookFormData) => {
    try {
      setLoading(true);
      // Add the book - duplicate check is handled in bookService.addBook
      await bookService.addBook(bookData);
      toast({
        title: "Success! 📚",
        description: `"${bookData.title}" has been added to your library!`,
      });
      sessionStorage.setItem('fromBookForm', 'true');
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message ? error.message.endsWith('!') || error.message.endsWith('.') ? error.message : error.message + '!' : "Failed to add book to your library!",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <BookForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AddBook;
