
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { BilingualText } from '@/components/BilingualText';
import { Rating } from '@/components/Rating';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Star, MapPin, Clock, PhoneCall, User } from 'lucide-react';
import { BottomNavigation } from '@/components/BottomNavigation';

// Mock data (in a real app this would come from API)
const labourData = {
  '1': {
    id: '1',
    name: 'Ahmed Khan',
    image: 'https://images.unsplash.com/photo-1618677831708-0e7fda3148b1',
    category: 'Electrician',
    rating: 4.8,
    distance: 2.5,
    experience: 5,
    hourlyRate: 500,
    phone: '+92 300 1234567',
    about: 'Professional electrician with 5 years of experience. Specializing in residential and commercial electrical installations, repairs and maintenance.',
    reviews: [
      {
        id: 'r1',
        user: 'Faraz Ahmed',
        rating: 5,
        comment: 'Very professional and skilled. Fixed my electrical issues quickly.',
        date: '2023-05-15',
      },
      {
        id: 'r2',
        user: 'Aisha Khan',
        rating: 4.5,
        comment: 'Good service but arrived a bit late. Overall satisfied with the work.',
        date: '2023-04-22',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Mohammed Ali',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca',
    category: 'Plumber',
    rating: 4.5,
    distance: 3.2,
    experience: 7,
    hourlyRate: 600,
    phone: '+92 300 7654321',
    about: 'Expert plumber with 7 years of experience. Specializing in plumbing repairs, installations, and drainage solutions for homes and businesses.',
    reviews: [
      {
        id: 'r1',
        user: 'Hamza Ali',
        rating: 5,
        comment: 'Very reliable and efficient. Fixed my leaking pipes perfectly.',
        date: '2023-06-10',
      },
      {
        id: 'r2',
        user: 'Saima Malik',
        rating: 4,
        comment: 'Good work quality but could improve on punctuality.',
        date: '2023-05-05',
      },
    ],
  },
};

const LabourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  // Get labour data based on ID
  const labour = labourData[id as keyof typeof labourData];
  
  if (!labour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Labour not found</p>
      </div>
    );
  }

  const handleCall = () => {
    window.location.href = `tel:${labour.phone}`;
  };

  const handleWhatsApp = () => {
    window.location.href = `https://wa.me/${labour.phone.replace(/\s+/g, '')}`;
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Header with back button */}
      <header className="glass sticky top-0 z-10 px-4 py-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        
        <h1 className="text-xl font-semibold">
          <BilingualText textKey={`category.${labour.category.toLowerCase()}`} />
        </h1>
      </header>
      
      <main className="px-4 py-6">
        {/* Profile header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
            <img
              src={labour.image}
              alt={labour.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-1">{labour.name}</h2>
          
          <div className="mb-2">
            <BilingualText textKey={`category.${labour.category.toLowerCase()}`} />
          </div>
          
          <div className="flex items-center mb-4">
            <Rating rating={labour.rating} size={20} />
          </div>
          
          {/* Stats cards */}
          <div className="w-full grid grid-cols-3 gap-3 mb-6">
            <div className="glass rounded-xl p-3 flex flex-col items-center">
              <Star size={18} className="mb-1 text-primary-blue" />
              <div className="text-sm font-medium">{labour.rating}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <BilingualText textKey="profile.rating" />
              </div>
            </div>
            
            <div className="glass rounded-xl p-3 flex flex-col items-center">
              <MapPin size={18} className="mb-1 text-primary-green" />
              <div className="text-sm font-medium">{labour.distance} km</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <BilingualText textKey="profile.distance" />
              </div>
            </div>
            
            <div className="glass rounded-xl p-3 flex flex-col items-center">
              <Clock size={18} className="mb-1 text-orange-500" />
              <div className="text-sm font-medium">{labour.experience}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <BilingualText textKey="profile.experience" />
              </div>
            </div>
          </div>
          
          {/* Contact buttons */}
          <div className="w-full flex gap-4 mb-8">
            <Button
              onClick={handleCall}
              className="flex-1 bg-primary-blue hover:bg-primary-blue/90"
            >
              <Phone size={16} className="mr-2" />
              <BilingualText textKey="button.call" />
            </Button>
            
            <Button
              onClick={handleWhatsApp}
              className="flex-1 bg-primary-green hover:bg-primary-green/90"
            >
              <PhoneCall size={16} className="mr-2" />
              <BilingualText textKey="button.whatsapp" />
            </Button>
          </div>
        </div>
        
        {/* About section */}
        <div className="glass rounded-xl p-4 mb-6">
          <h3 className={`font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t('profile.about')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {labour.about}
          </p>
        </div>
        
        {/* Rate */}
        <div className="glass rounded-xl p-4 mb-6">
          <h3 className={`font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t('profile.hourly_rate')}
          </h3>
          <p className="text-xl font-bold text-primary-blue">{labour.hourlyRate} PKR/hr</p>
        </div>
        
        {/* Reviews */}
        <div className="glass rounded-xl p-4">
          <h3 className={`font-semibold mb-4 flex items-center justify-between ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t('profile.reviews')}
            <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {labour.reviews.length}
            </span>
          </h3>
          
          <div className="space-y-4">
            {labour.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-2">
                      <User size={16} />
                    </div>
                    <span className="font-medium">{review.user}</span>
                  </div>
                  <Rating rating={review.rating} size={14} />
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {review.comment}
                </p>
                
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default LabourDetail;
