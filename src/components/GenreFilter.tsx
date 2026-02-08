import React from 'react';
import { Filter } from 'lucide-react';

interface GenreFilterProps {
  value: string;
  onChange: (genre: string) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ value, onChange }) => {
  return (
    <div className="genre-filter bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3">
        <Filter className="h-5 w-5 text-gray-500" />
        <label className="font-semibold text-gray-700 font-['Orbitron',monospace]" htmlFor="genre-filter-input">Genre:</label>
      </div>
      <input
        id="genre-filter-input"
        type="text"
        className="w-[180px] h-10 border border-white/20 rounded-xl px-3 mt-2 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium font-['Orbitron',monospace]"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Type genre..."
        aria-label="Filter books by genre"
      />
    </div>
  );
};

export default GenreFilter; 