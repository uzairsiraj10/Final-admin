
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-blue/20 to-primary-green/20">
      <div className="animate-fade-in w-full max-w-md">
        <GlassCard className="text-center" hover={false}>
          <h1 className="text-3xl font-bold mb-8">
            <span className="block mb-2">Select Language</span>
            <span className="block font-urdu text-3xl">زبان منتخب کریں</span>
          </h1>

          <div className="space-y-4">
            <button
              className={`w-full p-4 rounded-lg text-lg transition-all duration-300 ${
                language === 'en'
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>

            <button
              className={`w-full p-4 rounded-lg text-lg font-urdu transition-all duration-300 ${
                language === 'ur'
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => setLanguage('ur')}
            >
              اردو
            </button>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full mt-8 bg-gradient-to-r from-primary-blue to-primary-green text-white hover:opacity-90 transition-opacity"
            size="lg"
          >
            {language === 'en' ? 'Continue' : <span className="font-urdu">جاری رکھیں</span>}
          </Button>
        </GlassCard>
      </div>
    </div>
  );
};

export default LanguageSelector;
