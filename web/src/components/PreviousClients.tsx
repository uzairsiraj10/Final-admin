
import React from 'react';
import { BilingualText } from '@/components/BilingualText';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Rating } from '@/components/Rating';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';

// Mock data for previous clients
const clientsData = [
  {
    id: 'c1',
    name: 'Faraz Ahmed',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    date: '2023-05-15',
    job: 'Electrical Repair',
    rating: 5,
  },
  {
    id: 'c2',
    name: 'Aisha Khan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    date: '2023-04-22',
    job: 'Ceiling Fan Installation',
    rating: 4.5,
  },
  {
    id: 'c3',
    name: 'Hamza Ali',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    date: '2023-03-10',
    job: 'Wiring Repair',
    rating: 4.8,
  },
];

export const PreviousClients: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <div className="space-y-4">
      <h3 className={`font-semibold text-lg mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
        <BilingualText textKey="dashboard.previous_clients" />
      </h3>
      
      {clientsData.length === 0 ? (
        <Card className="p-4 text-center text-gray-500">
          <BilingualText textKey="dashboard.no_clients" />
        </Card>
      ) : (
        <div className="space-y-3">
          {clientsData.map((client) => (
            <Card key={client.id} className="p-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-medium">{client.name}</h4>
                    <p className="text-sm text-gray-500">{client.job}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <Rating rating={client.rating} size={16} />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(client.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
