
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BilingualText } from '@/components/BilingualText';
import { ProfileHeader } from '@/components/ProfileHeader';
import { DashboardTabs } from '@/components/DashboardTabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const LabourDashboard: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data for the labour profile
  const profile = {
    id: '1',
    name: 'Ahmed Khan',
    image: 'https://images.unsplash.com/photo-1618677831708-0e7fda3148b1',
    category: 'Electrician',
    experience: 5,
  };

  const handleProfileImageChange = (file: File) => {
    // In a real app, this would upload the file to a server
    toast({
      title: language === 'en' ? 'Profile Updated' : 'پروفائل اپڈیٹ ہو گیا',
      description: language === 'en' ? 
        'Your profile image has been updated' : 
        'آپ کی پروفائل تصویر کو اپڈیٹ کر دیا گیا ہے',
    });
  };
  
  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header with back button */}
      <header className="glass sticky top-0 z-10 px-4 py-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft size={20} />
        </Button>
        
        <h1 className="text-xl font-semibold">
          <BilingualText textKey="dashboard.title" />
        </h1>
      </header>
      
      <main className="px-4 py-6">
        {/* Profile Header with Avatar */}
        <ProfileHeader 
          name={profile.name} 
          imageSrc={profile.image}
          onImageChange={handleProfileImageChange}
        />
        
        {/* Dashboard Tabs */}
        <DashboardTabs />
      </main>
    </div>
  );
};

export default LabourDashboard;
