
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BilingualText } from '@/components/BilingualText';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const ProfileManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  // Mock data
  const [formData, setFormData] = React.useState({
    name: 'Ahmed Khan',
    phone: '+92 300 1234567',
    category: 'Electrician',
    experience: '5',
    description: 'Professional electrician with 5 years of experience.'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would save the data to a backend in a real app
    toast({
      title: language === 'en' ? 'Profile Updated' : 'پروفائل اپڈیٹ ہو گیا',
      description: language === 'en' ? 
        'Your profile has been successfully updated' : 
        'آپ کی پروفائل کامیابی سے اپڈیٹ کر دی گئی ہے',
    });
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              <BilingualText textKey="form.name" />
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">
              <BilingualText textKey="form.phone" />
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">
              <BilingualText textKey="form.category" />
            </Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience">
              <BilingualText textKey="form.experience" />
            </Label>
            <Input
              id="experience"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">
              <BilingualText textKey="form.description" />
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          
          <Button type="submit" className="w-full">
            <BilingualText textKey="button.save_changes" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
