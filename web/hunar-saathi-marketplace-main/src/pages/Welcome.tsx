
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { BilingualText } from '@/components/BilingualText';

const Welcome: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-blue/20 to-primary-green/20">
      <div className="animate-fade-in w-full max-w-md">
        <GlassCard className="text-center" hover={false}>
          <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t('auth.welcome')}
          </h1>
          
          <p className={`text-lg mb-8 text-gray-600 dark:text-gray-300 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t('auth.select_role')}
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => navigate('/login', { state: { role: 'customer' } })}
              variant="outline"
              className="w-full p-6 text-lg flex items-center justify-center hover:bg-secondary transition-all duration-300"
            >
              <BilingualText textKey="auth.customer" className="text-lg" />
            </Button>

            <Button
              onClick={() => navigate('/login', { state: { role: 'labour' } })}
              variant="outline"
              className="w-full p-6 text-lg flex items-center justify-center hover:bg-secondary transition-all duration-300"
            >
              <BilingualText textKey="auth.labour" className="text-lg" />
            </Button>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => navigate('/language')}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <BilingualText textKey="language.select" />
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Welcome;
