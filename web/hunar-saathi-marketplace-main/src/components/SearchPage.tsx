
import React, { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { BottomNavigation } from '@/components/BottomNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Mock data for search results
const mockData = [
  { id: 1, name: 'Ali Raza', category: 'electrician', location: 'Karachi', rating: 4.8, distance: 2.5 },
  { id: 2, name: 'Muhammad Imran', category: 'plumber', location: 'Lahore', rating: 4.5, distance: 3.2 },
  { id: 3, name: 'Ahmed Khan', category: 'carpenter', location: 'Islamabad', rating: 4.9, distance: 1.8 },
  { id: 4, name: 'Shahid Malik', category: 'painter', location: 'Rawalpindi', rating: 4.2, distance: 4.1 },
  { id: 5, name: 'Faisal Ahmed', category: 'electrician', location: 'Karachi', rating: 4.7, distance: 2.0 },
  { id: 6, name: 'Zain Ali', category: 'plumber', location: 'Lahore', rating: 4.6, distance: 1.5 },
  { id: 7, name: 'Bilal Hassan', category: 'carpenter', location: 'Islamabad', rating: 4.3, distance: 3.7 },
  { id: 8, name: 'Asad Mehmood', category: 'painter', location: 'Karachi', rating: 4.4, distance: 5.2 }
];

interface SearchResult {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  distance: number;
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showNearby, setShowNearby] = useState(false);
  const { t, language } = useLanguage();
  const location = useLocation();

  // Get any search parameters passed via routing
  useEffect(() => {
    if (location.state) {
      if (location.state.initialQuery) {
        setQuery(location.state.initialQuery);
      }
      if (location.state.filter === 'nearby') {
        setShowNearby(true);
      }
    }
  }, [location.state]);

  useEffect(() => {
    // Filter results based on query
    let filtered = [...mockData];
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) || 
        item.category.toLowerCase().includes(lowerQuery) ||
        item.location.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Sort by distance if nearby filter is active
    if (showNearby) {
      filtered.sort((a, b) => a.distance - b.distance);
    }
    
    setResults(filtered);
  }, [query, showNearby]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  return (
    <div className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-900">
      <div className="p-4 max-w-screen-xl mx-auto">
        <h1 className={`text-2xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
          {language === 'en' ? 'Search' : 'تلاش کریں'}
        </h1>
        
        <SearchBar onSearch={handleSearch} className="mb-4" />
        
        <div className="flex items-center space-x-2 mb-6">
          <Checkbox 
            id="nearby-search" 
            checked={showNearby} 
            onCheckedChange={(checked) => setShowNearby(checked as boolean)}
          />
          <div className="flex items-center space-x-1">
            <MapPin size={16} className="text-primary" />
            <Label htmlFor="nearby-search">
              {language === 'en' ? 'Sort by nearest' : 'قریب ترین کے لحاظ سے ترتیب دیں'}
            </Label>
          </div>
        </div>
        
        <AnimatePresence>
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{result.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {result.category} • {result.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/30 px-2 rounded-full">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm">{result.rating}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin size={12} className="mr-1" />
                        <span>{result.distance} km</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : query ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-8 text-gray-500"
            >
              {language === 'en' ? 'No results found' : 'کوئی نتیجہ نہیں ملا'}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-8 text-gray-500"
            >
              {language === 'en' 
                ? 'Start typing to search for services' 
                : 'سروسز تلاش کرنے کے لیے ٹائپ کرنا شروع کریں'
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default SearchPage;
