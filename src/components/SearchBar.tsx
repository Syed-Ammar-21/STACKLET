import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  'aria-label'?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search by title or author...",
  'aria-label': ariaLabel
}) => {
  return (
    <div className="search-bar relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Search className="h-5 w-5 text-gray-500" />
      </div>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium font-['Orbitron',monospace]"
      />
    </div>
  );
};

export default SearchBar; 