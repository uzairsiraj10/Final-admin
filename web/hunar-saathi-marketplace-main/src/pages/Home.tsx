
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { BilingualText } from '@/components/BilingualText';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCard } from '@/components/CategoryCard';
import { LabourCard, LabourData } from '@/components/LabouerCard';
import { Button } from '@/components/ui/button';
import { ShimmerCard } from '@/components/ShimmerCard';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Import icons
import { 
  User,
  MapPin,
} from 'lucide-react';

// Mock data for categories
const categories = [
  { id: 'electrician', name: 'Electrician' },
  { id: 'plumber', name: 'Plumber' },
  { id: 'carpenter', name: 'Carpenter' },
  { id: 'painter', name: 'Painter' },
  { id: 'cleaner', name: 'Cleaner' },
  { id: 'gardener', name: 'Gardener' },
  { id: 'driver', name: 'Driver' },
  { id: 'cook', name: 'Cook' },
];

// Mock data for labour workers
const labourWorkers: LabourData[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    image: 'https://images.unsplash.com/photo-1618677831708-0e7fda3148b1',
    category: 'Electrician',
    rating: 4.8,
    distance: 2.5,
    experience: 5,
  },
  {
    id: '2',
    name: 'Mohammed Ali',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca',
    category: 'Plumber',
    rating: 4.5,
    distance: 3.2,
    experience: 7,
  },
  {
    id: '3',
    name: 'Yasir Hussain',
    image: 'https://images.unsplash.com/photo-1514163061636-02db31852e84',
    category: 'Carpenter',
    rating: 4.3,
    distance: 1.8,
    experience: 4,
  },
  {
    id: '4',
    name: 'Bilal Ahmed',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    category: 'Painter',
    rating: 4.6,
    distance: 4.1,
    experience: 6,
  },
];

const Home: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNearby, setShowNearby] = useState(false);
  const [filteredLabourers, setFilteredLabourers] = useState<LabourData[]>(labourWorkers);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = labourWorkers.filter(worker => 
        worker.name.toLowerCase().includes(query.toLowerCase()) ||
        worker.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLabourers(filtered);
    } else {
      setFilteredLabourers(labourWorkers);
    }
  };

  useEffect(() => {
    // Filter workers based on nearby checkbox
    if (showNearby) {
      const sorted = [...labourWorkers].sort((a, b) => a.distance - b.distance);
      setFilteredLabourers(sorted);
    } else {
      setFilteredLabourers(labourWorkers);
    }
  }, [showNearby]);

  const handleCategoryClick = (categoryId: string) => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/category/${categoryId}`);
    }, 500);
  };

  const handleViewAll = (section: string) => {
    if (section === 'categories') {
      navigate('/category/all');
    } else if (section === 'top-rated') {
      navigate('/top-rated');
    } else if (section === 'nearby') {
      navigate('/search', { state: { filter: 'nearby' } });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="glass sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          <BilingualText textKey="app.name" />
        </h1>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate('/profile')}
          >
            <User size={20} />
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="px-4 py-6 animate-fade-in">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} className="mb-4" />
        
        {/* Location Filter */}
        <div className="flex items-center space-x-2 mb-6">
          <Checkbox 
            id="nearby" 
            checked={showNearby} 
            onCheckedChange={(checked) => setShowNearby(checked as boolean)}
          />
          <div className="flex items-center space-x-1">
            <MapPin size={16} className="text-primary" />
            <Label htmlFor="nearby">Find nearest workers</Label>
          </div>
        </div>
        
        {/* Categories Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              <BilingualText textKey="home.categories" />
            </h2>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => handleViewAll('categories')}
            >
              <BilingualText textKey="home.view_all" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                icon={getIconForCategory(category.id)}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </section>
        
        {/* Top Rated Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              <BilingualText textKey="home.top_rated" />
            </h2>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => handleViewAll('top-rated')}
            >
              <BilingualText textKey="home.view_all" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading ? 
              Array(2).fill(0).map((_, i) => (
                <ShimmerCard key={i} className="h-72" />
              )) : 
              filteredLabourers.slice(0, 2).map((labour) => (
                <LabourCard key={labour.id} labour={labour} />
              ))
            }
            {filteredLabourers.length === 0 && !isLoading && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No workers found matching your search
              </div>
            )}
          </div>
        </section>
        
        {/* Nearby Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              <BilingualText textKey="home.nearby" />
            </h2>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => handleViewAll('nearby')}
            >
              <BilingualText textKey="home.view_all" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(showNearby ? filteredLabourers : labourWorkers).slice(2, 4).map((labour) => (
              <LabourCard key={labour.id} labour={labour} />
            ))}
          </div>
        </section>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

// Helper function to get icons based on category
function getIconForCategory(category: string) {
  // Note: In a real app you'd use proper icons for each category
  // For this example we're using a simple circle with color variations
  
  const colors = {
    electrician: 'bg-blue-500',
    plumber: 'bg-green-500',
    carpenter: 'bg-yellow-500',
    painter: 'bg-purple-500',
    cleaner: 'bg-pink-500',
    gardener: 'bg-emerald-500',
    driver: 'bg-orange-500',
    cook: 'bg-red-500',
  };
  
  const color = colors[category as keyof typeof colors] || 'bg-gray-500';
  
  return (
    <div className={`${color} h-6 w-6 rounded-full`}></div>
  );
}

export default Home;
