
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BilingualText } from '@/components/BilingualText';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share, Copy, Check, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { BottomNavigation } from '@/components/BottomNavigation';

const ReferFriend: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Mock referral code
  const referralCode = 'AHMED500';
  const referralLink = `https://example.com/refer?code=${referralCode}`;
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    
    toast({
      title: language === 'en' ? 'Copied!' : 'کاپی ہو گیا!',
      description: language === 'en' ? 
        'Referral code copied to clipboard' : 
        'ریفرل کوڈ کلپ بورڈ پر کاپی کر دیا گیا ہے',
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: language === 'en' ? 'Join me on Labour App' : 'لیبر ایپ پر میرے ساتھ شامل ہوں',
          text: language === 'en' ? 
            'Use my referral code to sign up and earn 300 PKR' : 
            'سائن اپ کرنے اور 300 پی کے آر حاصل کرنے کے لیے میرا ریفرل کوڈ استعمال کریں',
          url: referralLink,
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        handleCopyCode();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  // Simulating a new referral joined notification
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
      toast({
        title: language === 'en' ? 'New Referral!' : 'نیا حوالہ!',
        description: language === 'en' ? 
          'Saad Ahmed just joined using your referral code! You earned 300 PKR.' : 
          'سعد احمد ابھی آپ کے ریفرل کوڈ کا استعمال کرتے ہوئے شامل ہوا! آپ نے 300 پی کے آر کمائے۔',
        variant: "default",
      });
      
      setTimeout(() => setShowAnimation(false), 5000);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Header with back button */}
      <header className="glass sticky top-0 z-10 px-4 py-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate('/labour-dashboard')}
        >
          <ArrowLeft size={20} />
        </Button>
        
        <h1 className="text-xl font-semibold">
          <BilingualText textKey="referral.title" />
        </h1>
      </header>
      
      <main className="px-4 py-6">
        {/* QR Code Section */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-primary-blue to-primary-green p-6 flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg mb-4 relative">
                {/* In a real app, generate QR code based on referral link */}
                <QrCode size={180} className="text-gray-800" />
                
                {/* Animated badge when someone joins */}
                {showAnimation && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs animate-bounce">
                    +1
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">
                <BilingualText textKey="referral.qr_title" />
              </h3>
              
              <p className="text-white/80 text-center text-sm">
                <BilingualText textKey="referral.qr_description" />
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Referral Code Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">
              <BilingualText textKey="referral.your_code" />
            </h3>
            
            <div className="flex items-center mb-4">
              <Input 
                value={referralCode} 
                readOnly 
                className="text-center font-semibold text-lg tracking-wider"
              />
              <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </Button>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-primary-blue to-primary-green hover:opacity-90"
              onClick={handleShare}
            >
              <Share className="mr-2 h-4 w-4" />
              <BilingualText textKey="button.share_code" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Instructions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">
              <BilingualText textKey="referral.how_it_works" />
            </h3>
            
            <ol className="list-decimal list-inside space-y-2 mb-3">
              <li>
                <BilingualText textKey="referral.step1" />
              </li>
              <li>
                <BilingualText textKey="referral.step2" />
              </li>
              <li>
                <BilingualText textKey="referral.step3" />
              </li>
            </ol>
            
            <p className="text-sm text-gray-500">
              <BilingualText textKey="referral.bonus_info" />
              <span className="font-bold text-primary-blue"> 300 PKR</span>
            </p>
          </CardContent>
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ReferFriend;
