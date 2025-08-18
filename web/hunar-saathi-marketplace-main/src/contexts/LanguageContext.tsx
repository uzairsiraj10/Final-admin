
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'app.name': 'Labour Marketplace',
    'language.english': 'English',
    'language.urdu': 'اردو',
    'language.select': 'Select language',
    'button.continue': 'Continue',
    'button.back': 'Back',
    'button.signup': 'Sign Up',
    'button.login': 'Login',
    'button.call': 'Call',
    'button.whatsapp': 'WhatsApp',
    'button.back_home': 'Return to Home',

    // Auth
    'auth.welcome': 'Welcome',
    'auth.login': 'Login to your account',
    'auth.signup': 'Create an account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.no_account': 'Don\'t have an account?',
    'auth.has_account': 'Already have an account?',
    'auth.customer': 'Customer',
    'auth.labour': 'Service Provider',
    'auth.select_role': 'Select your role',

    // Home
    'home.search': 'Search services...',
    'home.categories': 'Categories',
    'home.top_rated': 'Top Rated',
    'home.nearby': 'Nearby',
    'home.view_all': 'View All',

    // Categories
    'category.electrician': 'Electrician',
    'category.plumber': 'Plumber',
    'category.carpenter': 'Carpenter',
    'category.painter': 'Painter',
    'category.cleaner': 'Cleaner',
    'category.gardener': 'Gardener',
    'category.driver': 'Driver',
    'category.cook': 'Cook',

    // Labour Profile
    'profile.experience': 'Experience',
    'profile.years': 'years',
    'profile.rating': 'Rating',
    'profile.distance': 'Distance',
    'profile.reviews': 'Reviews',
    'profile.about': 'About',
    'profile.contact': 'Contact Information',
    'profile.hourly_rate': 'Hourly Rate',
    'profile.book_now': 'Book Now',

    // Filters
    'filter.title': 'Filters',
    'filter.distance': 'Distance',
    'filter.rating': 'Rating',
    'filter.price': 'Price',
    'filter.experience': 'Experience',
    'filter.clear': 'Clear All',
    'filter.apply': 'Apply Filters',

    // Labour Dashboard
    'dashboard.profile': 'Profile',
    'dashboard.jobs': 'Jobs',
    'dashboard.earnings': 'Earnings',
    'dashboard.referrals': 'Referrals',
    'dashboard.settings': 'Settings',
    'referral.title': 'Refer a Friend',
    'referral.description': 'Share your referral code and earn 300 PKR for each new service provider who joins.',
    'referral.code': 'Your Referral Code',
    'referral.share': 'Share',

    // Error Pages
    'page.not_found': 'Page Not Found',
    'error.page_not_exists': 'The page you are looking for doesn\'t exist or has been moved.',
  },
  ur: {
    // Common
    'app.name': 'لیبر مارکیٹ پلیس',
    'language.english': 'English',
    'language.urdu': 'اردو',
    'language.select': 'زبان منتخب کریں',
    'button.continue': 'جاری رکھیں',
    'button.back': 'واپس',
    'button.signup': 'سائن اپ کریں',
    'button.login': 'لاگ ان کریں',
    'button.call': 'کال کریں',
    'button.whatsapp': 'واٹس ایپ',
    'button.back_home': 'گھر واپس جائیں',

    // Auth
    'auth.welcome': 'خوش آمدید',
    'auth.login': 'اپنے اکاؤنٹ میں لاگ ان کریں',
    'auth.signup': 'اکاؤنٹ بنائیں',
    'auth.email': 'ای میل',
    'auth.password': 'پاس ورڈ',
    'auth.name': 'پورا نام',
    'auth.phone': 'فون نمبر',
    'auth.no_account': 'اکاؤنٹ نہیں ہے؟',
    'auth.has_account': 'پہلے سے اکاؤنٹ ہے؟',
    'auth.customer': 'کسٹمر',
    'auth.labour': 'سروس فراہم کنندہ',
    'auth.select_role': 'اپنا کردار منتخب کریں',

    // Home
    'home.search': 'سروسز تلاش کریں...',
    'home.categories': 'زمرہ جات',
    'home.top_rated': 'اعلیٰ درجہ بندی',
    'home.nearby': 'قریبی',
    'home.view_all': 'سب دیکھیں',

    // Categories
    'category.electrician': 'الیکٹریشن',
    'category.plumber': 'پلمبر',
    'category.carpenter': 'بڑھئی',
    'category.painter': 'پینٹر',
    'category.cleaner': 'صفائی والا',
    'category.gardener': 'مالی',
    'category.driver': 'ڈرائیور',
    'category.cook': 'باورچی',

    // Labour Profile
    'profile.experience': 'تجربہ',
    'profile.years': 'سال',
    'profile.rating': 'درجہ بندی',
    'profile.distance': 'فاصلہ',
    'profile.reviews': 'جائزے',
    'profile.about': 'تفصیل',
    'profile.contact': 'رابطہ کی معلومات',
    'profile.hourly_rate': 'فی گھنٹہ ریٹ',
    'profile.book_now': 'ابھی بک کریں',

    // Filters
    'filter.title': 'فلٹرز',
    'filter.distance': 'فاصلہ',
    'filter.rating': 'درجہ بندی',
    'filter.price': 'قیمت',
    'filter.experience': 'تجربہ',
    'filter.clear': 'سب صاف کریں',
    'filter.apply': 'فلٹرز لاگو کریں',

    // Labour Dashboard
    'dashboard.profile': 'پروفائل',
    'dashboard.jobs': 'کام',
    'dashboard.earnings': 'کمائی',
    'dashboard.referrals': 'ریفرلز',
    'dashboard.settings': 'ترتیبات',
    'referral.title': 'دوست کو بھیجیں',
    'referral.description': 'اپنا ریفرل کوڈ شیئر کریں اور ہر نئے سروس فراہم کنندہ کے شامل ہونے پر 300 روپے کمائیں۔',
    'referral.code': 'آپ کا ریفرل کوڈ',
    'referral.share': 'شیئر کریں',

    // Error Pages
    'page.not_found': 'صفحہ نہیں ملا',
    'error.page_not_exists': 'جس صفحے کو آپ تلاش کر رہے ہیں وہ موجود نہیں ہے یا منتقل کر دیا گیا ہے۔',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'ur') ? savedLanguage : 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
