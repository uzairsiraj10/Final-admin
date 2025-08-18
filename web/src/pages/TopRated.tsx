
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BottomNavigation } from '@/components/BottomNavigation';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Mock data for top rated labour
const topRatedLabour = [
  { 
    id: 1, 
    name: 'Ali Raza', 
    category: 'electrician', 
    rating: 4.9, 
    reviews: 124,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    verified: true
  },
  { 
    id: 2, 
    name: 'Muhammad Imran', 
    category: 'plumber', 
    rating: 4.8, 
    reviews: 98,
    image: 'https://randomuser.me/api/portraits/men/33.jpg',
    verified: true
  },
  { 
    id: 3, 
    name: 'Ahmed Khan', 
    category: 'carpenter', 
    rating: 4.8, 
    reviews: 156,
    image: 'https://randomuser.me/api/portraits/men/34.jpg',
    verified: true
  },
  { 
    id: 4, 
    name: 'Shahid Malik', 
    category: 'painter', 
    rating: 4.7, 
    reviews: 87,
    image: 'https://randomuser.me/api/portraits/men/35.jpg',
    verified: false
  },
  { 
    id: 5, 
    name: 'Faisal Ahmed', 
    category: 'electrician', 
    rating: 4.7, 
    reviews: 112,
    image: 'https://randomuser.me/api/portraits/men/36.jpg',
    verified: true
  },
  { 
    id: 6, 
    name: 'Zain Ali', 
    category: 'plumber', 
    rating: 4.6, 
    reviews: 74,
    image: 'https://randomuser.me/api/portraits/men/37.jpg',
    verified: false
  }
];

const TopRated: React.FC = () => {
  const { language } = useLanguage();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Function to render stars with animation
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= Math.floor(rating);
      const halfFilled = !filled && i === Math.ceil(rating) && (rating % 1) > 0;
      
      stars.push(
        <motion.span 
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`text-lg ${filled || halfFilled ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          {filled ? '★' : halfFilled ? '⭐' : '☆'}
        </motion.span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-900">
      <div className="p-4 max-w-screen-xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${language === 'ur' ? 'font-urdu text-right' : ''}`}>
          {language === 'en' ? 'Top Rated' : 'سب سے اعلی درجہ بندی والے'}
        </h1>
        
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {topRatedLabour.map((labour) => (
            <motion.div
              key={labour.id}
              variants={item}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex p-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <img 
                    src={labour.image} 
                    alt={labour.name}
                    className="w-full h-full object-cover rounded-lg" 
                  />
                  {labour.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{labour.name}</h3>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-400 mr-1" fill="currentColor" />
                      <span>{labour.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {labour.category}
                  </p>
                  <div className="mt-2 flex">
                    {renderStars(labour.rating)}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      ({labour.reviews} {language === 'en' ? 'reviews' : 'جائزے'})
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default TopRated;
