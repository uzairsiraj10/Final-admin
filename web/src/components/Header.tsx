
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "404", 
  showBackButton = true 
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="h-16 flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className={`text-lg font-semibold ${language === 'ur' ? 'font-urdu' : ''}`}>{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
