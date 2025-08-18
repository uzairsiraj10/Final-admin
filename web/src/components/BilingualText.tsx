
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface BilingualTextProps {
  textKey: string;
  className?: string;
}

export const BilingualText: React.FC<BilingualTextProps> = ({ textKey, className }) => {
  const { t, language } = useLanguage();
  
  return (
    <span className={cn(language === 'ur' ? 'font-urdu' : '', className)}>
      {t(textKey)}
    </span>
  );
};
