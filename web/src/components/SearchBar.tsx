
import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className }) => {
  const [query, setQuery] = useState('');
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate('/search', { state: { initialQuery: query } });
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <Search 
        size={18} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        placeholder={t('home.search')}
        className={`pl-10 pr-4 py-6 w-full rounded-full bg-white dark:bg-gray-800 border-gray-200 
          dark:border-gray-700 ${language === 'ur' ? 'font-urdu' : ''}`}
      />
    </div>
  );
};
