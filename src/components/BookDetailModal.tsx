import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Book } from '@/types';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, isOpen, onClose }) => {
  if (!book) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/20 shadow-2xl text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white font-['Orbitron',monospace]">
            📖 {book.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Book Cover and Basic Info */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={`Cover of ${book.title}`}
                  className="w-32 h-48 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-32 h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400">
                  <span>No cover found</span>
                  <label className="mt-2 text-sm text-blue-600 cursor-pointer underline">
                    Enter Cover URL
                    <input
                      type="text"
                      className="block mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Paste image URL here"
                      onChange={e => {/* TODO: handle updating the book cover URL */}}
                    />
                  </label>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white font-['Orbitron',monospace]">Author</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm text-gray-800 font-['Orbitron',monospace]">
                    ✍️ {book.author}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white font-['Orbitron',monospace]">Rating</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm text-gray-800 font-['Orbitron',monospace]">
                  ⭐ {book.rating}/5 
                  </Badge>
                </div>
              </div>

              {book.category && book.category !== 'General' && (
                <div>
                  <h3 className="text-lg font-semibold text-white font-['Orbitron',monospace]">Genre</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm text-gray-800 font-['Orbitron',monospace]">
                      📚 {book.category}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* User Notes */}
          {book.summary && (
            <div>
              <h3 className="text-lg font-semibold text-white font-['Orbitron',monospace] mb-3">
               Notes
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-gray-800 font-['Orbitron',monospace] leading-relaxed whitespace-pre-wrap">
                  {book.summary}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailModal; 