
import React from 'react';
import { GlassCard } from './GlassCard';
import { BilingualText } from './BilingualText';

interface CategoryCardProps {
  id: string;
  icon: React.ReactNode;
  name: string; 
  onClick: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ id, icon, name, onClick }) => {
  return (
    <GlassCard 
      className="flex flex-col items-center justify-center p-6 cursor-pointer"
      onClick={() => onClick(id)}
    >
      <div className="h-12 w-12 flex items-center justify-center mb-3 bg-primary-blue/10 rounded-full">
        {icon}
      </div>
      <BilingualText 
        textKey={`category.${name.toLowerCase()}`}
        className="text-center font-medium"
      />
    </GlassCard>
  );
};
