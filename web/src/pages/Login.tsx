
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BilingualText } from '@/components/BilingualText';
import { motion } from 'framer-motion';

interface LocationState {
  role?: 'customer' | 'labour';
}

const Login: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = (location.state as LocationState) || { role: 'customer' };
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    // Email validation
    if (!email) {
      setEmailError(language === 'en' ? 'Email is required' : 'ای میل ضروری ہے');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(language === 'en' ? 'Invalid email address' : 'غلط ای میل ایڈریس');
      isValid = false;
    }
    
    // Password validation
    if (!password) {
      setPasswordError(language === 'en' ? 'Password is required' : 'پاس ورڈ ضروری ہے');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'customer') {
        navigate('/home', { replace: true });
      } else {
        navigate('/labour-dashboard', { replace: true });
      }
    }, 1500);
  };

  const handleSignUp = () => {
    navigate('/signup', { state: { role } });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-blue/20 to-primary-green/20"
    >
      <div className="animate-fade-in w-full max-w-md">
        <GlassCard className="text-center" hover={false}>
          <h1 className={`text-3xl font-bold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t('app.name')}
          </h1>
          <h2 className={`text-xl font-semibold mb-6 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t('auth.login')}
          </h2>
          
          <div className="mb-4 text-center">
            <span className={`text-md ${language === 'ur' ? 'font-urdu' : ''}`}>
              {role === 'customer' ? t('auth.customer') : t('auth.labour')}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-start">
              <label className={`block text-sm mb-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t('auth.email')}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder={language === 'en' ? "Email" : "ای میل"}
                className={`w-full ${emailError ? 'border-red-500' : ''}`}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>
            
            <div className="text-start">
              <label className={`block text-sm mb-1 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t('auth.password')}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder={language === 'en' ? "Password" : "پاس ورڈ"}
                className={`w-full ${passwordError ? 'border-red-500' : ''}`}
              />
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

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
                <BilingualText textKey="button.login" />
              )}
            </Button>
          </form>

          <div className="mt-6">
            <p className={`text-sm text-gray-600 dark:text-gray-300 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {t('auth.no_account')}
            </p>
            <Button 
              variant="link" 
              onClick={handleSignUp}
              className={`mt-1 ${language === 'ur' ? 'font-urdu' : ''}`}
            >
              {t('button.signup')}
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
    </motion.div>
  );
};

export default Login;
