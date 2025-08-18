
import React from 'react';
import { BilingualText } from '@/components/BilingualText';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Gift, TrendingUp } from 'lucide-react';

// Mock referral data
const referralData = {
  totalReferrals: 5,
  pendingReferrals: 2,
  successfulReferrals: 3,
  earnings: 900, // PKR
};

export const ReferralStats: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary-blue/90 to-primary-blue text-white">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <UserPlus className="mb-2 h-8 w-8" />
            <p className="text-sm opacity-90">
              <BilingualText textKey="referrals.total" />
            </p>
            <h3 className="text-3xl font-bold">{referralData.totalReferrals}</h3>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary-green/90 to-primary-green text-white">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Gift className="mb-2 h-8 w-8" />
            <p className="text-sm opacity-90">
              <BilingualText textKey="referrals.earnings" />
            </p>
            <h3 className="text-3xl font-bold">{referralData.earnings} PKR</h3>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-primary-blue/10 to-primary-green/10 flex items-center justify-between">
          <h3 className={`font-semibold ${language === 'ur' ? 'font-urdu' : ''}`}>
            <BilingualText textKey="referrals.program" />
          </h3>
          <TrendingUp className="text-primary-blue" />
        </div>
        
        <CardContent className="p-6">
          <p className={`mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
            <BilingualText textKey="referrals.description" />
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              <BilingualText textKey="referrals.point1" />
              <span className="font-semibold"> 300 PKR</span>
            </li>
            <li>
              <BilingualText textKey="referrals.point2" />
            </li>
          </ul>
          
          <div className="animate-pulse">
            <Button 
              className="w-full bg-gradient-to-r from-primary-blue to-primary-green hover:opacity-90" 
              onClick={() => navigate('/refer-friend')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              <BilingualText textKey="button.refer_friend" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
