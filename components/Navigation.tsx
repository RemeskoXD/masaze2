import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  clientSectionEnabled?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ clientSectionEnabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'O mně', href: '#about' },
    { name: 'Služby a Ceník', href: '#services' },
    { name: 'Rezervace', href: '#reservation' },
    { name: 'Recenze', href: '#reviews' },
    { name: 'E-shop (Houby)', href: '#eshop', isExternal: false },
  ];

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 w-full z-50 px-4 sm:px-6 lg:px-8 pt-6 pointer-events-none"
    >
      <nav 
        className={`mx-auto max-w-7xl rounded-full transition-all duration-500 pointer-events-auto ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gold/10 py-2.5 px-3.5 sm:px-6' 
            : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-sm py-3.5 px-3.5 sm:px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 max-w-[70%] sm:max-w-none">
            <a href="#home" className="font-serif text-[15px] xs:text-base sm:text-lg md:text-2xl font-medium tracking-[0.08em] sm:tracking-widest transition-colors duration-300 text-text-dark hover:text-gold-dark block truncate sm:overflow-visible">
              TEREZA ROZKOŠNÁ
            </a>
          </div>
          <div className="hidden lg:block">
            <div className="ml-8 flex items-center space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="transition-colors duration-300 px-3 py-2 rounded-full text-[10px] xl:text-xs font-semibold uppercase tracking-[0.1em] xl:tracking-[0.15em] text-text-dark hover:text-gold-dark hover:bg-gold/10 whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center space-x-2 pl-2 border-l border-gold/20">
                  <a
                    href="#vouchers"
                    className="transition-colors duration-300 px-4 py-2 bg-gold text-white rounded-full text-[10px] xl:text-xs font-semibold uppercase tracking-[0.1em] hover:bg-gold-dark hover:shadow-lg whitespace-nowrap"
                  >
                    Dárkové poukazy
                  </a>
                  {clientSectionEnabled && (
                  <a
                    href="#client-area"
                    className="transition-colors duration-300 px-3 py-2 border border-gold/40 text-gold-dark rounded-full text-[10px] xl:text-xs font-semibold uppercase tracking-[0.1em] hover:bg-gold/5 whitespace-nowrap"
                  >
                    Klientská sekce
                  </a>
                  )}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full focus:outline-none transition-colors text-text-dark hover:text-gold-dark bg-white/50"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-4 space-y-1 bg-white/95 backdrop-blur-xl rounded-2xl border border-gold/10 shadow-lg flex flex-col">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-text-muted hover:text-gold-dark hover:bg-gold/5 block px-4 py-3 rounded-xl text-sm font-medium text-center transition-colors uppercase tracking-widest"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="h-px w-full bg-gold/10 my-2"></div>
                <a
                    href="#vouchers"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-gold-dark bg-gold block px-4 py-3 mx-2 rounded-xl text-sm font-medium text-center transition-colors uppercase tracking-widest shadow-md"
                >
                    Dárkové poukazy
                </a>
                {clientSectionEnabled && (
                <a
                    href="#client-area"
                    onClick={() => setIsOpen(false)}
                    className="text-gold-dark hover:bg-gold/5 border border-gold/30 block px-4 py-3 mx-2 rounded-xl text-sm font-medium text-center transition-colors uppercase tracking-widest mt-2"
                >
                    Klientská sekce
                </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  );
};

export default Navigation;