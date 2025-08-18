
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BilingualText } from '@/components/BilingualText';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

interface LocationState {
  role?: 'customer' | 'labour';
}

const SignUp: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = (location.state as LocationState) || { role: 'customer' };
  
  const [isLoading, setIsLoading] = useState(false);

  // Create schema with validation rules
  const formSchema = z.object({
    name: z.string().min(3, {
      message: language === 'en' ? 'Name must be at least 3 characters' : 'نام کم از کم 3 حروف کا ہونا چاہیے'
    }),
    email: z.string().email({
      message: language === 'en' ? 'Please enter a valid email address' : 'براہ کرم درست ای میل ایڈریس درج کریں'
    }),
    phone: z.string().min(10, {
      message: language === 'en' ? 'Phone number must be at least 10 digits' : 'فون نمبر کم از کم 10 ہندسوں کا ہونا چاہیے'
    }).max(15),
    idCard: role === 'labour' ? z.string().min(13, {
      message: language === 'en' ? 'ID Card number must be 13 digits' : 'شناختی کارڈ نمبر 13 ہندسوں کا ہونا چاہیے'
    }).max(13) : z.string().optional(),
    password: z.string().min(8, {
      message: language === 'en' ? 'Password must be at least 8 characters' : 'پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے'
    }),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: language === 'en' ? 'Passwords do not match' : 'پاس ورڈ مماثل نہیں ہیں',
    path: ['confirmPassword'],
  });

  // Initialize form with resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      idCard: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'customer') {
        navigate('/home', { replace: true });
      } else {
        navigate('/labour-dashboard', { replace: true });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-blue/20 to-primary-green/20">
      <div className="animate-fade-in w-full max-w-md">
        <GlassCard className="text-center" hover={false}>
          <h1 className={`text-3xl font-bold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t('app.name')}
          </h1>
          <h2 className={`text-xl font-semibold mb-6 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t('auth.signup')}
          </h2>

          <div className="mb-4 text-center">
            <span className={`text-md ${language === 'ur' ? 'font-urdu' : ''}`}>
              {role === 'customer' ? t('auth.customer') : t('auth.labour')}
            </span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="text-start">
                    <FormLabel className={`${language === 'ur' ? 'font-urdu' : ''}`}>
                      {t('auth.name')}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={language === 'en' ? "Full Name" : "پورا نام"} 
                        {...field} 
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-start">
                    <FormLabel className={`${language === 'ur' ? 'font-urdu' : ''}`}>
                      {t('auth.email')}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder={language === 'en' ? "Email" : "ای میل"} 
                        {...field}
                        className="w-full" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="text-start">
                    <FormLabel className={`${language === 'ur' ? 'font-urdu' : ''}`}>
                      {t('auth.phone')}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={language === 'en' ? "Phone Number" : "فون نمبر"} 
                        {...field}
                        className="w-full" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {role === 'labour' && (
                <FormField
                  control={form.control}
                  name="idCard"
                  render={({ field }) => (
                    <FormItem className="text-start">
                      <FormLabel className={`${language === 'ur' ? 'font-urdu' : ''}`}>
                        {language === 'en' ? "ID Card Number" : "شناختی کارڈ نمبر"}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={language === 'en' ? "13-digit CNIC" : "13 ہندسوں کا شناختی کارڈ"} 
                          {...field}
                          className="w-full" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="text-start">
                    <FormLabel className={`${language === 'ur' ? 'font-urdu' : ''}`}>
                      {t('auth.password')}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={language === 'en' ? "Password" : "پاس ورڈ"} 
                        {...field}
                        className="w-full" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="text-start">
                    <FormLabel className={`${language === 'ur' ? 'font-urdu' : ''}`}>
                      {language === 'en' ? "Confirm Password" : "پاس ورڈ کی تصدیق کریں"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={language === 'en' ? "Confirm Password" : "پاس ورڈ کی تصدیق کریں"} 
                        {...field}
                        className="w-full" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-primary-blue to-primary-green text-white hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className={language === 'ur' ? 'font-urdu' : ''}>
                      {language === 'en' ? 'Loading...' : 'لوڈ ہو رہا ہے...'}
                    </span>
                  </div>
                ) : (
                  <BilingualText textKey="button.signup" />
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <p className={`text-sm text-gray-600 dark:text-gray-300 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {t('auth.has_account')}
            </p>
            <Button 
              variant="link" 
              onClick={() => navigate('/login', { state: { role } })}
              className={`mt-1 ${language === 'ur' ? 'font-urdu' : ''}`}
            >
              {t('button.login')}
            </Button>
          </div>

          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/welcome')}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <BilingualText textKey="button.back" />
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SignUp;
