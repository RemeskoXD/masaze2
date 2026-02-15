import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const FloatingContact: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Phone Button */}
      <a 
        href={`tel:${CONTACT_INFO.phoneClean}`} 
        className="flex items-center justify-center w-14 h-14 bg-gold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] text-deep-green hover:scale-110 transition-transform duration-300 group relative"
        aria-label="Zavolat"
      >
        <Phone size={24} fill="currentColor" />
        <span className="absolute right-16 bg-white text-deep-green px-3 py-1 rounded shadow-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Zavolat
        </span>
      </a>

      {/* Email/Reservation Button */}
      <a 
        href="#reservation" 
        className="flex items-center justify-center w-14 h-14 bg-deep-green border-2 border-gold rounded-full shadow-lg text-gold hover:bg-gold hover:text-deep-green transition-all duration-300 group relative"
        aria-label="Rezervovat"
      >
        <Mail size={24} />
        <span className="absolute right-16 bg-white text-deep-green px-3 py-1 rounded shadow-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Rezervovat
        </span>
      </a>
    </div>
  );
};

export default FloatingContact;