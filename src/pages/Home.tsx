import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BookCard from '@/components/BookCard';
import BookDetailModal from '@/components/BookDetailModal';
import Navbar from '@/components/Navbar';
import SortControls from '@/components/SortControls';
import SearchBar from '@/components/SearchBar';
import GenreFilter from '@/components/GenreFilter';
import { bookService } from '@/services/bookService';
import { Book, SortOption } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import { Book as BookIcon } from 'lucide-react';

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(() => {
    // Check if coming from login and set initial loading state
    const isFromLogin = sessionStorage.getItem('fromLogin') === 'true';
    return !isFromLogin; // false if coming from login, true otherwise
  });
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>('date_newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      // Always show loading animation
      setLoading(true);
      
      const booksData = await bookService.getBooks();
      setBooks(booksData);
      
      // Check if coming from add/edit book (shorter loading)
      const isFromBookForm = sessionStorage.getItem('fromBookForm') === 'true';
      const loadingTime = isFromBookForm ? 500 : 1000; // 0.5 seconds if from book form, 1 second otherwise
      
      // Show loading for the determined time, then show the actual content
      setTimeout(() => {
        setLoading(false);
        setShowAnimation(true);
        // Clear the flag
        sessionStorage.removeItem('fromBookForm');
      }, loadingTime);
      
    } catch (error: any) {
      toast({
        title: "Error!",
        description: "Failed to fetch books!",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const uniqueGenres = Array.from(new Set(books.map(book => book.category).filter(Boolean))) as string[];

  const filterBooks = (booksToFilter: Book[], search: string, genre: string): Book[] => {
    let filtered = booksToFilter;
    if (genre.trim()) {
      const genreLower = genre.toLowerCase().trim();
      filtered = filtered.filter(book => (book.category || '').toLowerCase().includes(genreLower));
    }
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower)
      );
    }
    return filtered;
  };

  const sortBooks = (booksToSort: Book[], sortBy: SortOption): Book[] => {
    return [...booksToSort].sort((a, b) => {
      switch (sortBy) {
        case 'date_newest': {
          const dateA = new Date(Math.max(
            new Date(a.created_at).getTime(),
            a.updated_at ? new Date(a.updated_at).getTime() : 0
          ));
          const dateB = new Date(Math.max(
            new Date(b.created_at).getTime(),
            b.updated_at ? new Date(b.updated_at).getTime() : 0
          ));
          return dateB.getTime() - dateA.getTime(); // Newest first
        }
        case 'date_oldest': {
          const dateA = new Date(Math.max(
            new Date(a.created_at).getTime(),
            a.updated_at ? new Date(a.updated_at).getTime() : 0
          ));
          const dateB = new Date(Math.max(
            new Date(b.created_at).getTime(),
            b.updated_at ? new Date(b.updated_at).getTime() : 0
          ));
          return dateA.getTime() - dateB.getTime(); // Oldest first
        }
        case 'rating_highest':
          return b.rating - a.rating; // Highest rating first
        case 'rating_lowest':
          return a.rating - b.rating; // Lowest rating first
        default:
          return 0;
      }
    });
  };

  const handleSortChange = (newSort: SortOption) => {
    setCurrentSort(newSort);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Apply genre filter, then search, then sort
  const filteredBooks = filterBooks(books, searchTerm, genreFilter);
  const sortedBooks = sortBooks(filteredBooks, currentSort);

  const handleEditBook = (book: Book) => {
    navigate(`/edit-book/${book.id}`, { state: { book } });
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await bookService.deleteBook(id);
      setBooks(prev => prev.filter(book => book.id !== id));
      toast({
        title: "Book Removed 🗑️",
        description: "Book has been removed from your library!",
      });
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message ? error.message.endsWith('!') || error.message.endsWith('.') ? error.message : error.message + '!' : "Failed to delete book!",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedBook(null);
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const processBooks = async (data: any[]) => {
      if (!data.length) return;
      setLoading(true);
      let addedCount = 0;
      let skippedCount = 0;
      for (const bookData of data) {
        const exists = await bookService.bookExistsByTitle(bookData.title);
        if (exists) {
          skippedCount++;
          continue;
        }
        try {
          await bookService.addBook(bookData);
          addedCount++;
        } catch (error) {
          skippedCount++;
        }
      }
      setLoading(false);
      if (addedCount > 0) {
        toast({
          title: 'Success! 📚',
          description: `${addedCount} book${addedCount > 1 ? 's' : ''} added to your library!${skippedCount > 0 ? ` (${skippedCount} duplicate${skippedCount > 1 ? 's' : ''} skipped.)` : ''}`,
        });
        fetchBooks(); // Refresh library
      } else {
        toast({
          title: 'No Book Added.',
          description: 'No new books were added. All books already exist in your library.',
          variant: 'destructive',
        });
      }
    };

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processBooks(results.data);
        },
        error: (error) => {
          toast({
            title: 'Error!',
            description: 'Failed to parse CSV file!',
            variant: 'destructive',
          });
        },
      });
    } else if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
        const headers = headerLine.split(',').map(h => h.trim());
        const data = lines.map(line => {
          const values = line.split(',');
          const row: any = {};
          headers.forEach((h, i) => row[h] = values[i]?.trim() || '');
          return row;
        });
        processBooks(data);
      };
      reader.readAsText(file);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <img
          src="/translogo.png"
          alt="Bookish Notes Organizer"
          className="w-20 h-20 object-contain animate-bounce mb-4"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <p className="text-white text-2xl font-['Orbitron',monospace] font-medium">Loading your personal library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          {showAnimation && (
            <div className="animate-slide-down flex flex-col items-center justify-center">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4 shadow-xl animate-float justify-center">
                <div className="text-3xl animate-bounce-slow">✨</div>
                <p className="text-2xl font-serif text-gray-800 italic">
                  "Keep reading, keep growing!"
                </p>
                <div className="text-3xl animate-bounce-slow" style={{ animationDelay: '0.5s' }}>✨</div>
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mx-auto rounded-full mt-4 shadow-lg animate-glow"></div>
            </div>
          )}
        </div>

        {books.length === 0 ? (
          <div className="empty-state flex flex-col justify-center items-center text-center bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full mx-auto animate-float font-['Orbitron',monospace] p-8">
            <h2 className="text-4xl font-black tracking-wider select-none text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text mb-8 uppercase" style={{ letterSpacing: '0.1em' }}>
              Your Library is Empty
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full mt-4">
              <button 
                className="flex-1 min-w-[140px] btn-add bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold px-4 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 text-base sm:text-xl tracking-wider font-['Orbitron',monospace] animate-glow flex items-center gap-2"
                onClick={() => navigate('/add-book')}
              >
                <span className="text-xl">+</span>
                Add Book
              </button>
              <label htmlFor="import-csv-empty" className="flex-1 min-w-[140px] btn-add bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-extrabold px-4 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 text-base sm:text-xl tracking-wider font-['Orbitron',monospace] animate-glow cursor-pointer flex items-center gap-2 justify-center">
                Import CSV
                <input
                  id="import-csv-empty"
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleImportCSV}
                />
              </label>
            </div>
          </div>
        ) : (
          <>
            <div className="library-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl px-4 py-3 sm:px-8 sm:py-4 text-base sm:text-xl font-black tracking-wider font-['Orbitron',monospace] text-gray-800 flex items-center gap-3">
                <span className="text-2xl text-blue-600">📖</span>
                <span>
                  {searchTerm ? `${sortedBooks.length} of ${books.length}` : books.length} {books.length === 1 ? 'book' : 'books'} in your collection
                  {searchTerm && <span className="text-blue-600 ml-2 font-medium">(filtered)</span>}
                </span>
              </div>
              <div className="flex gap-4">
                <button 
                  className="flex-1 min-w-[140px] btn-add bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold px-4 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 text-base sm:text-xl tracking-wider font-['Orbitron',monospace] animate-glow flex items-center gap-2"
                  onClick={() => navigate('/add-book')}
                >
                  <span className="text-xl">+</span>
                  Add Book
                </button>
                <label htmlFor="import-csv" className="flex-1 min-w-[140px] btn-add bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-extrabold px-4 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 text-base sm:text-xl tracking-wider font-['Orbitron',monospace] animate-glow cursor-pointer flex items-center gap-2 justify-center">
                  <span className="text-xl">⇪</span>
                  Import CSV
                  <input
                    id="import-csv"
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={handleImportCSV}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mb-10 items-stretch">
              <div className="flex-1">
                <SearchBar 
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  placeholder="Search by title or author..."
                  aria-label="Search books by title or author"
                />
              </div>
              <div className="flex-shrink-0 flex items-center">
                <GenreFilter 
                  value={genreFilter}
                  onChange={setGenreFilter}
                />
              </div>
              <div className="flex-shrink-0 flex items-center">
                <SortControls 
                  currentSort={currentSort} 
                  onSortChange={handleSortChange} 
                />
              </div>
            </div>

            <div className="books-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedBooks.map((book, index) => {
                const isFromLogin = sessionStorage.getItem('fromLogin') === 'true';
                return (
                  <div 
                    key={book.id} 
                    className="animate-card-fade-in"
                    style={{ 
                      animationDelay: isFromLogin ? '0s' : `${index * 0.1}s`,
                      animationFillMode: 'both'
                    }}
                  >
                    <BookCard
                      book={book}
                      onEdit={handleEditBook}
                      onDelete={handleDeleteBook}
                      onViewDetails={handleViewDetails}
                    />
                  </div>
                );
              })}
            </div>

            {searchTerm && sortedBooks.length === 0 && (
              <div className="empty-state flex flex-col justify-center items-center text-center bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full mx-auto animate-float font-['Orbitron',monospace] p-8">
                <h2 className="text-4xl font-black tracking-wider select-none text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text mb-8 uppercase" style={{ letterSpacing: '0.1em' }}>
                  No Books Match
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-lg">
                  No books match <span className="font-semibold text-blue-600">"{searchTerm}"</span> in title or author
                </p>
                <button 
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg hover:underline transition-colors"
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedBook && (
        <BookDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          book={selectedBook}
        />
      )}
    </div>
  );
};

export default Home;
