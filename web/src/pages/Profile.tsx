
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BottomNavigation } from '@/components/BottomNavigation';
import { BilingualText } from '@/components/BilingualText';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { User, LogOut, Edit, Mail, Phone, Star } from 'lucide-react';
import { EditProfileDialog } from '@/components/EditProfileDialog';

const ProfilePage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Mock user data (in a real app, this would come from a context or API)
  const [userData, setUserData] = useState({
    name: 'Ahmed Khan',
    email: 'ahmed.khan@example.com',
    phone: '+92 300 1234567',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'customer',
  });

  // Mock reviews data
  const [reviews] = useState([
    { id: 1, serviceName: 'Plumbing repair', rating: 4.5, comment: 'Very professional and quick service.', date: '2023-10-15' },
    { id: 2, serviceName: 'Electrical work', rating: 5, comment: 'Excellent work fixing my electrical issues.', date: '2023-09-22' },
    { id: 3, serviceName: 'Carpentry', rating: 4, comment: 'Good quality work but took longer than expected.', date: '2023-08-05' },
  ]);

  const handleLogout = () => {
    // In a real app, clear authentication state/tokens here
    toast({
      title: language === 'en' ? 'Logged out successfully' : 'کامیابی سے لاگ آؤٹ ہو گیا',
      description: language === 'en' ? 'You have been logged out' : 'آپ لاگ آؤٹ ہو گئے ہیں',
    });
    
    // Navigate to login page
    navigate('/login');
  };

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
    toast({
      title: language === 'en' ? 'زبان تبدیل ہو گئی' : 'Language Changed',
      description: language === 'en' ? 'زبان اردو میں تبدیل کر دی گئی ہے' : 'Language changed to English',
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-900">
      <div className="p-4 max-w-screen-xl mx-auto">
        <h1 className={`text-2xl font-bold mb-4 ${language === 'ur' ? 'font-urdu text-right' : ''}`}>
          {language === 'en' ? 'Profile' : 'پروفائل'}
        </h1>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* Profile Card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary-blue/10 p-6">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                        <img 
                          src={userData.profileImage} 
                          alt={userData.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold">{userData.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {language === 'en' ? 'Customer' : 'کسٹمر'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center">
                    <Mail className="text-gray-500 mr-2" size={18} />
                    <p>{userData.email}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="text-gray-500 mr-2" size={18} />
                    <p>{userData.phone}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleEditProfile}
                      className="flex items-center"
                    >
                      <Edit size={16} className="mr-2" />
                      <span className={language === 'ur' ? 'font-urdu' : ''}>
                        {language === 'en' ? 'Edit Profile' : 'پروفائل میں ترمیم کریں'}
                      </span>
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      onClick={handleLogout}
                      className="flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      <span className={language === 'ur' ? 'font-urdu' : ''}>
                        {language === 'en' ? 'Logout' : 'لاگ آؤٹ'}
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Language Switch */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="language-switch" className={language === 'ur' ? 'font-urdu' : ''}>
                      {language === 'en' ? 'Language' : 'زبان'}
                    </Label>
                    <span className="text-sm text-gray-500">
                      {language === 'en' ? 'English / اردو' : 'English / اردو'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={language === 'en' ? 'font-bold' : ''}>EN</span>
                    <Switch 
                      id="language-switch" 
                      checked={language === 'ur'}
                      onCheckedChange={handleLanguageToggle}
                    />
                    <span className={language === 'ur' ? 'font-bold font-urdu' : 'font-urdu'}>اردو</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Reviews Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <h3 className={`text-lg font-semibold ${language === 'ur' ? 'font-urdu' : ''}`}>
                  {language === 'en' ? 'My Reviews' : 'میرے جائزے'}
                </h3>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">
                      <span className={language === 'ur' ? 'font-urdu' : ''}>
                        {language === 'en' ? 'All' : 'تمام'}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="recent" className="flex-1">
                      <span className={language === 'ur' ? 'font-urdu' : ''}>
                        {language === 'en' ? 'Recent' : 'حالیہ'}
                      </span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-4 space-y-4">
                    {reviews.map((review) => (
                      <motion.div 
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: review.id * 0.1 }}
                        className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">{review.serviceName}</h4>
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                            <span>{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{review.comment}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">{review.date}</p>
                      </motion.div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="recent" className="mt-4 space-y-4">
                    {reviews.slice(0, 2).map((review) => (
                      <motion.div 
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: review.id * 0.1 }}
                        className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">{review.serviceName}</h4>
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                            <span>{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{review.comment}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">{review.date}</p>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Edit Profile Dialog */}
      <EditProfileDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        userData={{
          name: userData.name,
          email: userData.email,
          phone: userData.phone
        }}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
