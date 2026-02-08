
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';
import { Book } from '@/types';

interface BookDetailViewProps {
  book: Book;
  onBack: () => void;
}

const BookDetailView: React.FC<BookDetailViewProps> = ({ book, onBack }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-6 h-6 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-6 hover:bg-gray-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Library
      </Button>

      <Card className="shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <img 
                src={book.cover_url || 'https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg'} 
                alt={`${book.title} cover`}
                className="w-48 h-72 object-cover rounded-xl shadow-lg mx-auto md:mx-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg';
                }}
              />
            </div>

            {/* Book Info */}
            <div className="flex-1 text-center md:text-left">
              <CardTitle className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {book.title}
              </CardTitle>
              
              <p className="text-xl text-gray-600 mb-6 font-medium">
                by {book.author}
              </p>

              {/* Rating */}
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <div className="flex gap-1">
                  {renderStars(book.rating)}
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {book.rating}/5 Stars
                </span>
              </div>

              {/* Date Added */}
              <div className="bg-white px-4 py-2 rounded-full inline-block shadow-md">
                <span className="text-sm font-medium text-gray-600">
                  📅 Added on {formatDate(book.created_at)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Summary */}
          {book.summary && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary</h3>
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-700 leading-relaxed">
                  {book.summary}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            <Button 
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-xl"
              onClick={onBack}
            >
              Continue Browsing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookDetailView;
