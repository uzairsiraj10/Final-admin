
import React from 'react';
import { GlassCard } from './GlassCard';
import { BilingualText } from './BilingualText';
import { Rating } from './Rating';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export interface LabourData {
  id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  distance: number;
  experience: number;
}

interface LabourCardProps {
  labour: LabourData;
}

export const LabourCard: React.FC<LabourCardProps> = ({ labour }) => {
  const navigate = useNavigate();
  
  return (
    <GlassCard 
      className="overflow-hidden"
      onClick={() => navigate(`/labour/${labour.id}`)}
    >
      <div className="relative h-40 mb-3 overflow-hidden rounded-lg bg-gray-200">
        <img 
          src={labour.image} 
          alt={labour.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h3 className="font-medium text-lg mb-1">{labour.name}</h3>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        <BilingualText textKey={`category.${labour.category.toLowerCase()}`} />
      </div>
      
      <div className="flex items-center justify-between">
        <Rating rating={labour.rating} />
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin size={14} className="mr-1" />
          <span>{labour.distance} km</span>
        </div>
      </div>
    </GlassCard>
  );
};
