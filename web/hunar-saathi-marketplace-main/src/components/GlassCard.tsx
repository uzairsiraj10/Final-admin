
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hover = true,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'glass rounded-xl p-4', 
        hover && 'transition-all duration-300 hover:shadow-xl hover:scale-[1.02]',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};
