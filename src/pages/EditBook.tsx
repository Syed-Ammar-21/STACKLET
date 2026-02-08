import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import BookForm from '@/components/BookForm';
import Navbar from '@/components/Navbar';
import { bookService } from '@/services/bookService';
import { BookFormData, Book } from '@/types';
import { useToast } from '@/hooks/use-toast';

const EditBook: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const editingBook = location.state?.book as Book;

  const handleSubmit = async (bookData: BookFormData) => {
    if (!id) return;
    
    try {
      setLoading(true);
      await bookService.updateBook(id, bookData);
      
      setTimeout(() => {
        toast({
          title: "Success! ✨",
          description: "Book updated successfully!",
        });
        
        sessionStorage.setItem('fromBookForm', 'true');
        navigate('/');
      }, 500);
      
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message ? error.message.endsWith('!') || error.message.endsWith('.') ? error.message : error.message + '!' : "Failed to update book!",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!editingBook) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Book not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <BookForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          editingBook={editingBook}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default EditBook;
