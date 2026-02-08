import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/types';
import { Edit, Trash2, Star, Download } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onViewDetails: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete, onViewDetails }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDateDisplay = () => {
    if (book.updated_at && book.updated_at !== book.created_at) {
      return `Updated: ${formatDate(book.updated_at)}`;
    }
    return `Added: ${formatDate(book.created_at)}`;
  };

  const isImportedBook = () => {
    return book.user_id === null && book.books === 'imported';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onViewDetails(book);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <Card 
      className="group hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-105 active:scale-100 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-xl cursor-pointer relative"
      onClick={handleCardClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out rounded-3xl"></div>
      
      <div className="aspect-[3/4] overflow-hidden relative">
        {/* Actual image */}
        <img
          src={book.cover_url || 'https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg'}
          alt={book.title}
          className={`w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-active:scale-100 ${
            imageLoaded 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Fallback for image error */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📖</div>
              <div className="text-xs text-gray-600 font-medium px-2 text-center">
                {book.title}
              </div>
            </div>
          </div>
        )}
        
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
        
        {/* Imported Badge */}
        {isImportedBook() && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">Imported</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 relative">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-gray-900 transition-colors duration-300 ease-in-out font-serif italic">
          {book.title}
        </h3>
        {/* Category Badge */}
        {book.category && (
          <div className="mb-2">
            <Badge className={`text-xs font-semibold px-2 py-1 rounded-full ${book.category === 'Imported' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-700'} font-serif italic`}>{book.category}</Badge>
          </div>
        )}
        <p className="text-gray-600 mb-3 font-medium text-sm group-hover:text-gray-700 transition-colors duration-300 ease-in-out font-serif italic">
          by {book.author}
        </p>
        
        <div className="flex items-center gap-1.5 mb-4 font-serif italic">
          {renderStars(book.rating)}
          <span className="text-xs text-gray-500 ml-1 font-medium font-serif italic">({book.rating}/5)</span>
        </div>

        {/* Tags */}
        {/* {book.tags && book.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {book.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {book.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{book.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )} */}
        
        <div className="text-xs text-gray-500 mb-4 font-medium font-serif italic">
          {getDateDisplay()}
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(book);
            }}
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 text-xs font-semibold transition-all duration-300 ease-in-out rounded-xl border-gray-200 transform hover:scale-105 active:scale-95"
          >
            <Edit className="w-3 h-3 mr-1.5" />
            Edit
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book.id);
            }}
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-xs font-semibold transition-all duration-300 ease-in-out rounded-xl border-gray-200 transform hover:scale-105 active:scale-95"
          >
            <Trash2 className="w-3 h-3 mr-1.5" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
