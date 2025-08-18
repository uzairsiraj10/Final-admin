
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Star, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const navItems = [
    { 
      icon: Home, 
      label: language === 'en' ? 'Home' : 'ہوم', 
      path: '/home' 
    },
    { 
      icon: Search, 
      label: language === 'en' ? 'Search' : 'تلاش', 
      path: '/search' 
    },
    { 
      icon: Star, 
      label: language === 'en' ? 'Top Rated' : 'اعلی درجہ', 
      path: '/top-rated' 
    },
    { 
      icon: User, 
      label: language === 'en' ? 'Profile' : 'پروفائل', 
      path: '/profile' 
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    // Use navigate instead of regular link navigation to avoid page reloads
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center py-3 px-2 w-full transition-colors duration-200 ${
                isActive(item.path) 
                  ? 'text-primary' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ 
                  scale: isActive(item.path) ? [1, 1.2, 1] : 1,
                  y: isActive(item.path) ? [0, -4, 0] : 0
                }}
                transition={{ 
                  duration: 0.3,
                  times: isActive(item.path) ? [0, 0.5, 1] : [0, 1]
                }}
                className="relative"
              >
                <item.icon size={20} />
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navigation-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
              <span className={`text-xs mt-1 ${
                language === 'ur' ? 'font-urdu' : ''
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
