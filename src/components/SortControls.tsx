import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortOption } from '@/types';
import { ArrowUpDown, ArrowUp, ArrowDown, ArrowRight, Calendar, Star } from 'lucide-react';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="genre-filter bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3">
        <ArrowUpDown className="h-5 w-5 text-gray-500" />
        <label className="font-semibold text-gray-700 font-['Orbitron',monospace]" htmlFor="sort-select">Sort by:</label>
      </div>
      <Select value={currentSort} onValueChange={(value: SortOption) => onSortChange(value)}>
        <SelectTrigger id="sort-select" className="w-[220px] h-10 border border-white/20 rounded-xl px-3 mt-2 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 font-medium font-['Orbitron',monospace] truncate overflow-hidden whitespace-nowrap">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl">
          <SelectItem value="date_newest" className="hover:bg-blue-50 focus:bg-blue-50 rounded-lg mx-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Date Added (N <ArrowRight className="w-4 h-4 inline text-blue-600" /> O)
            </div>
          </SelectItem>
          <SelectItem value="date_oldest" className="hover:bg-blue-50 focus:bg-blue-50 rounded-lg mx-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Date Added (O <ArrowRight className="w-4 h-4 inline text-blue-600" /> N)
            </div>
          </SelectItem>
          <SelectItem value="rating_highest" className="hover:bg-yellow-50 focus:bg-yellow-50 rounded-lg mx-1">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Rating <ArrowUp className="w-4 h-4 inline text-yellow-500" />
            </div>
          </SelectItem>
          <SelectItem value="rating_lowest" className="hover:bg-yellow-50 focus:bg-yellow-50 rounded-lg mx-1">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Rating <ArrowDown className="w-4 h-4 inline text-yellow-500" />
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortControls;
