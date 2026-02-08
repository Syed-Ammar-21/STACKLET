import React, { useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  className?: string;
}

const defaultCategories = [
  'General',
  'Thriller',
  'Fiction',
  'Non-Fiction',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'History',
  'Mystery',
  'Self-Help',
];

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, options, className }) => {
  const categories = options || defaultCategories;
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customGenre, setCustomGenre] = useState('');
  const [error, setError] = useState('');

  const handleSelectChange = (selected: string) => {
    if (selected === 'custom') {
      setShowCustomInput(true);
      setCustomGenre('');
      setError('');
    } else {
      setShowCustomInput(false);
      setError('');
      onChange(selected);
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setCustomGenre(inputValue);
    setError('');
  };

  const validateAndSave = (inputValue: string) => {
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue) {
      setShowCustomInput(false);
      return;
    }

    // Check if the genre already exists (case-insensitive)
    const exists = categories.some(cat => 
      cat.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (exists) {
      setError(`"${trimmedValue}" is already in the list. Please choose from existing genres or type something different.`);
      return;
    }

    // Save the custom genre
    onChange(trimmedValue);
    setShowCustomInput(false);
    setError('');
  };

  const handleCustomInputBlur = () => {
    validateAndSave(customGenre);
  };

  const handleCustomInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validateAndSave(customGenre);
    }
  };

  const isCustom = value && !categories.includes(value);

  return (
    <div>
      {!showCustomInput ? (
        <Select value={isCustom ? 'custom' : value} onValueChange={handleSelectChange}>
          <SelectTrigger className={`h-12 text-lg w-full border rounded-md px-3 py-2 ${className || ''}`}>
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div>
          <input
            className={`flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : ''} ${className || ''}`}
            value={customGenre}
            onChange={handleCustomInputChange}
            onBlur={handleCustomInputBlur}
            onKeyPress={handleCustomInputKeyPress}
            placeholder="Enter custom genre"
            autoFocus
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
      {isCustom && !showCustomInput && (
        <div className="mt-2 text-sm text-gray-600">
          Current genre: {value}
        </div>
      )}
    </div>
  );
};

export default CategorySelect; 