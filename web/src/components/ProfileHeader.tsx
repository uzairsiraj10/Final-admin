
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BilingualText } from '@/components/BilingualText';
import { Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileHeaderProps {
  name: string;
  imageSrc?: string;
  onImageChange?: (file: File) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  name, 
  imageSrc, 
  onImageChange 
}) => {
  const { language } = useLanguage();
  const [previewImage, setPreviewImage] = useState<string | undefined>(imageSrc);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      
      // Pass the file to parent component
      if (onImageChange) {
        onImageChange(file);
      }
    }
  };

  return (
    <div className="glass flex flex-col items-center p-6 rounded-xl mb-6">
      <div className="relative mb-4">
        <Avatar className="w-24 h-24 border-4 border-white shadow-lg cursor-pointer" onClick={handleImageClick}>
          <AvatarImage src={previewImage} />
          <AvatarFallback className="bg-primary-blue text-white text-2xl">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute bottom-0 right-0 bg-primary-blue rounded-full p-1.5 cursor-pointer"
             onClick={handleImageClick}>
          <Camera size={16} className="text-white" />
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      
      <h2 className="text-xl font-bold">{name}</h2>
      
      <div className="mt-4 w-full">
        <Button 
          variant="outline" 
          className="w-full flex justify-center items-center gap-2"
          onClick={handleImageClick}
        >
          <Camera size={16} />
          <span className={language === 'ur' ? 'font-urdu' : ''}>
            <BilingualText textKey="dashboard.change_photo" />
          </span>
        </Button>
      </div>
    </div>
  );
};
