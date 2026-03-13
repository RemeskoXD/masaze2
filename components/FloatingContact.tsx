import React, { useState, useEffect } from 'react';
import { Phone, Mail } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const FloatingContact: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-40 flex flex-col gap-3"
        >
          {/* Phone Button */}
          <a 
            href={`tel:${CONTACT_INFO.phoneClean}`} 
            className="flex items-center justify-center w-14 h-14 bg-gold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] text-white hover:scale-110 transition-transform duration-300 group relative"
            aria-label="Zavolat"
          >
            <Phone size={24} fill="currentColor" />
            <span className="absolute right-16 bg-white text-text-dark px-3 py-1 rounded shadow-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Zavolat
            </span>
          </a>

          {/* Email/Reservation Button */}
          <a 
            href="#reservation" 
            className="flex items-center justify-center w-14 h-14 bg-white border-2 border-gold rounded-full shadow-lg text-gold-dark hover:bg-gold hover:text-white transition-all duration-300 group relative"
            aria-label="Rezervovat"
          >
            <Mail size={24} />
            <span className="absolute right-16 bg-white text-text-dark px-3 py-1 rounded shadow-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Rezervovat
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingContact;