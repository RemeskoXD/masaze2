import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navigation: React.FC = () => {
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
    { name: 'Úvod', href: '#home' },
    { name: 'O mně', href: '#about' },
    { name: 'Služby a Ceník', href: '#services' },
    { name: 'Rezervace', href: '#reservation' },
    { name: 'Recenze', href: '#reviews' },
    { name: 'Kontakt', href: '#contact' },
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
            ? 'bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gold/10 py-2 px-6' 
            : 'bg-white/50 backdrop-blur-md border border-white/20 shadow-sm py-4 px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <a href="#home" className="font-serif text-xl md:text-2xl font-medium tracking-widest transition-colors duration-300 text-text-dark hover:text-gold-dark">
              TEREZA ROZKOŠNÁ
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="transition-colors duration-300 px-3 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted hover:text-gold-dark hover:bg-gold/5"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
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
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-4 space-y-1 bg-white/95 backdrop-blur-xl rounded-2xl border border-gold/10 shadow-lg">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  );
};

export default Navigation;