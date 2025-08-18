
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: {
    name: string;
    email: string;
    phone: string;
  };
}

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  userData
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update user data via API
    toast({
      title: language === 'en' ? 'Profile Updated' : 'پروفائل اپڈیٹ ہو گیا',
      description: language === 'en' ? 'Your profile information has been updated' : 'آپ کی پروفائل کی معلومات اپڈیٹ کر دی گئی ہیں',
    });
    
    onOpenChange(false);
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={language === 'ur' ? 'font-urdu text-right' : ''}>
            {language === 'en' ? 'Edit Profile' : 'پروفائل میں ترمیم کریں'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <motion.div 
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={inputVariants}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="name" className={language === 'ur' ? 'font-urdu' : ''}>
              {language === 'en' ? 'Name' : 'نام'}
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Your name' : 'آپ کا نام'}
              className={language === 'ur' ? 'text-right font-urdu' : ''}
            />
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={inputVariants}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="email" className={language === 'ur' ? 'font-urdu' : ''}>
              {language === 'en' ? 'Email' : 'ای میل'}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Your email' : 'آپ کا ای میل'}
              className={language === 'ur' ? 'text-right' : ''}
            />
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={inputVariants}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="phone" className={language === 'ur' ? 'font-urdu' : ''}>
              {language === 'en' ? 'Phone' : 'فون نمبر'}
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Your phone number' : 'آپ کا فون نمبر'}
              className={language === 'ur' ? 'text-right' : ''}
            />
          </motion.div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className={language === 'ur' ? 'font-urdu' : ''}
            >
              {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
            </Button>
            <Button 
              type="submit"
              className={language === 'ur' ? 'font-urdu' : ''}
            >
              {language === 'en' ? 'Save Changes' : 'تبدیلیاں محفوظ کریں'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
