import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Úvod', href: '#home' },
    { name: 'O mně', href: '#about' },
    { name: 'Služby a Ceník', href: '#services' },
    { name: 'Rezervace', href: '#reservation' },
    { name: 'Recenze', href: '#reviews' },
    { name: 'Kontakt', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-deep-green/95 backdrop-blur-sm border-b border-gold/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#home" className="font-serif text-2xl text-gold font-bold tracking-wider">
              TEREZA ROZKOŠNÁ
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-soft-white hover:text-gold transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gold hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-deep-green border-t border-gold/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-gold block px-3 py-2 rounded-md text-base font-medium text-center"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;