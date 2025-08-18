
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BilingualText } from "@/components/BilingualText";
import { BottomNavigation } from "@/components/BottomNavigation";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate("/home");
  };

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
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <>
      <Header title={t('page.not_found')} />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-16 pb-16">
        <motion.div 
          className="text-center px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="relative inline-block">
              <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                404
              </div>
              <motion.div 
                className="absolute -bottom-4 w-full h-1 bg-gradient-to-r from-primary to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.7, delay: 0.5 }}
              />
            </div>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants} 
            className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200"
          >
            <BilingualText textKey="page.not_found" />
          </motion.h1>
          
          <motion.p 
            variants={itemVariants} 
            className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
          >
            <BilingualText textKey="error.page_not_exists" />
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <button
              onClick={handleGoHome}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 mx-auto hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Home size={18} />
              <BilingualText textKey="button.back_home" />
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      <BottomNavigation />
    </>
  );
};

export default NotFound;
