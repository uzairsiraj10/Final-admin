
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { BilingualText } from '@/components/BilingualText';
import { LabourCard, LabourData } from '@/components/LabouerCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { ShimmerCard } from '@/components/ShimmerCard';
import { BottomNavigation } from '@/components/BottomNavigation';

// Mock data for labour workers by category
const labourWorkersByCategory: Record<string, LabourData[]> = {
  electrician: [
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
      id: '5',
      name: 'Zafar Iqbal',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
      category: 'Electrician',
      rating: 4.2,
      distance: 3.7,
      experience: 3,
    },
    {
      id: '9',
      name: 'Tariq Mehmood',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857',
      category: 'Electrician',
      rating: 4.5,
      distance: 5.1,
      experience: 8,
    },
  ],
  plumber: [
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
      id: '6',
      name: 'Arshad Khan',
      image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a',
      category: 'Plumber',
      rating: 4.1,
      distance: 4.3,
      experience: 6,
    },
  ],
  carpenter: [
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
      id: '7',
      name: 'Khalid Mahmood',
      image: 'https://images.unsplash.com/photo-1541577141970-eebc83ebe30e',
      category: 'Carpenter',
      rating: 4.7,
      distance: 2.9,
      experience: 9,
    },
  ],
  painter: [
    {
      id: '4',
      name: 'Bilal Ahmed',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      category: 'Painter',
      rating: 4.6,
      distance: 4.1,
      experience: 6,
    },
    {
      id: '8',
      name: 'Saleem Abbas',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      category: 'Painter',
      rating: 4.4,
      distance: 3.5,
      experience: 5,
    },
  ],
};

// Add empty arrays for other categories to avoid errors
['cleaner', 'gardener', 'driver', 'cook'].forEach(cat => {
  if (!labourWorkersByCategory[cat]) {
    labourWorkersByCategory[cat] = [];
  }
});

const CategoryList: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [labourers, setLabourers] = useState<LabourData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      if (categoryId && labourWorkersByCategory[categoryId]) {
        setLabourers(labourWorkersByCategory[categoryId]);
      }
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [categoryId]);

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Header */}
      <header className="glass sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          
          <h1 className="text-xl font-semibold">
            {categoryId && (
              <BilingualText textKey={`category.${categoryId.toLowerCase()}`} />
            )}
          </h1>
        </div>
        
        <Button variant="outline" size="sm" className="flex items-center">
          <SlidersHorizontal size={16} className="mr-2" />
          <BilingualText textKey="filter.title" />
        </Button>
      </header>
      
      <main className="px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <ShimmerCard key={i} className="h-72" />
            ))}
          </div>
        ) : (
          <>
            {labourers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {labourers.map((labour) => (
                  <LabourCard key={labour.id} labour={labour} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 p-6 rounded-full bg-gray-100 dark:bg-gray-800">
                  <SlidersHorizontal size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No service providers found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  We couldn't find any service providers in this category. Try a different category or check back later.
                </p>
              </div>
            )}
          </>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CategoryList;
