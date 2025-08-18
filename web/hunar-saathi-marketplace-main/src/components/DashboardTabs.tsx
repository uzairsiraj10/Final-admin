
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { BilingualText } from '@/components/BilingualText';
import { ProfileManagement } from '@/components/ProfileManagement';
import { PreviousClients } from '@/components/PreviousClients';
import { ReferralStats } from '@/components/ReferralStats';
import { User, FileText, UserPlus } from 'lucide-react';

interface DashboardTabsProps {
  defaultTab?: string;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ defaultTab = "profile" }) => {
  const { language } = useLanguage();
  
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User size={16} />
          <span className={language === 'ur' ? 'font-urdu' : ''}>
            <BilingualText textKey="tabs.profile" />
          </span>
        </TabsTrigger>
        
        <TabsTrigger value="clients" className="flex items-center gap-2">
          <FileText size={16} />
          <span className={language === 'ur' ? 'font-urdu' : ''}>
            <BilingualText textKey="tabs.clients" />
          </span>
        </TabsTrigger>
        
        <TabsTrigger value="referrals" className="flex items-center gap-2">
          <UserPlus size={16} />
          <span className={language === 'ur' ? 'font-urdu' : ''}>
            <BilingualText textKey="tabs.referrals" />
          </span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="animate-fade-in">
        <ProfileManagement />
      </TabsContent>
      
      <TabsContent value="clients" className="animate-fade-in">
        <PreviousClients />
      </TabsContent>
      
      <TabsContent value="referrals" className="animate-fade-in">
        <ReferralStats />
      </TabsContent>
    </Tabs>
  );
};
